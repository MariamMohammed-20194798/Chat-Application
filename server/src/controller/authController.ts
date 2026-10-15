import { Request, Response, NextFunction, RequestHandler } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { CustomRequest } from './customRequest';
import { supabaseAuth, supabaseAdmin } from '../lib/supabase';
import { getProfileById } from '../services/userService';
import { profileToApiUser } from '../utils/mongoCompat';

const cookieOptions = (req: Request) => ({
  httpOnly: true,
  secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  sameSite: 'lax' as const,
});

const createSendToken = async (
  accessToken: string,
  refreshToken: string | undefined,
  userId: string,
  statusCode: number,
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('createSendToken called for user:', userId);

  const profile = await getProfileById(userId);

  if (!profile) {
    console.error('Profile not found for user:', userId);
    res.status(500).json({
      status: 'error',
      message: 'User profile not found. Please try signing up again.',
    });
    return;
  }

  console.log('Profile found:', profile);

  const expiresDays = Number(process.env.JWT_COOKIE_EXPIRES_IN) || 90;
  res.cookie('jwt', accessToken, {
    ...cookieOptions(req),
    expires: new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000),
  });

  if (refreshToken) {
    res.cookie('refresh_token', refreshToken, {
      ...cookieOptions(req),
      expires: new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000),
    });
  }

  const user = profileToApiUser(profile);

  res.status(statusCode).json({
    status: 'success',
    token: accessToken,
    data: { user },
  });
};

interface SignupBody {
  email: string;
  username: string;
  password: string;
}

export const signup: RequestHandler = catchAsync(
  async (req: CustomRequest<SignupBody>, res, next) => {
    const email = req.body.email?.trim().toLowerCase();
    const username = req.body.username?.trim();
    const { password } = req.body;

    console.log('Signup request body:', {
      email,
      username,
      passwordLength: password?.length,
    });

    if (!email || !username || !password) {
      console.log('Missing fields:', {
        email: !email,
        username: !username,
        password: !password,
      });
      return next(new AppError('Username, email and password are required', 400));
    }

    if (password.length < 8) {
      return next(new AppError('Password must be at least 8 characters', 400));
    }

    console.log('Attempting Supabase signup for:', email);
    const { data, error } = await supabaseAuth.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${process.env.CLIENT_URL || 'http://localhost:3000'}/login`,
      },
    });

    if (error) {
      console.error('Supabase signup error:', error);

      if (error.status === 0 || error.name === 'AuthRetryableFetchError') {
        return next(
          new AppError(
            'Unable to connect to Supabase. Please check your network or try again later.',
            503,
          ),
        );
      }

      if (
        error.code === 'unexpected_failure' &&
        error.message.toLowerCase().includes('confirmation email')
      ) {
        return next(
          new AppError(
            'Could not send the confirmation email. Check the Send Email Hook URL, hook secret, and SMTP settings.',
            502,
          ),
        );
      }

      if (error.message.includes('already registered')) {
        return next(new AppError('Duplicate email. Please use another value!', 409));
      }

      return next(new AppError(error.message, error.status || 400));
    }

    console.log('Supabase signup successful, user ID:', data.user?.id);

    // Supabase hides whether an email exists when email enumeration protection is enabled.
    if (data.user && data.user.identities?.length === 0) {
      return next(new AppError('Duplicate email. Please use another value!', 409));
    }

    if (!data.session || !data.user) {
      res.status(201).json({
        status: 'success',
        requiresEmailConfirmation: true,
        message:
          'Your account is ready. Check your inbox to confirm your email before signing in.',
      });
      return;
    }

    await createSendToken(
      data.session.access_token,
      data.session.refresh_token,
      data.user.id,
      201,
      req,
      res,
    );
  },
);

export const login: RequestHandler = catchAsync(async (req: CustomRequest, res, next) => {
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;

  console.log('Login request body:', {
    email,
    passwordLength: password?.length,
  });

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session || !data.user) {
    console.error('Supabase login failed:', {
      email,
      error: {
        message: error?.message,
        status: error?.status,
        code: error?.code,
        name: error?.name,
      },
    });

    if (error?.code === 'email_not_confirmed') {
      return next(
        new AppError(
          'Email not confirmed. Please check your inbox and confirm your email before logging in.',
          401,
        ),
      );
    }

    return next(new AppError('Incorrect email or password', 401));
  }

  await createSendToken(
    data.session.access_token,
    data.session.refresh_token,
    data.user.id,
    200,
    req,
    res,
  );
});

export const protect: RequestHandler = catchAsync(
  async (req: CustomRequest, res: Response, next) => {
    const token: string | undefined = req.cookies.jwt;

    if (!token) {
      return next(new AppError('please login to access this route', 401));
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      return next(new AppError('please login to access this route', 401));
    }

    const profile = await getProfileById(data.user.id);
    if (!profile) {
      return next(new AppError('please login to access this route', 404));
    }

    req.user = profileToApiUser(profile);
    req.accessToken = token;
    next();
  },
);

export const logout: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      await supabaseAuth.auth.signOut();
    }

    res.cookie('jwt', '', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.cookie('refresh_token', '', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      status: 'success',
      message: 'logged out successfully',
      user: req.user,
    });
  },
);

export const forgotPassword: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) {
      return next(new AppError('Please provide your email address', 400));
    }

    const redirectTo = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password`;
    const { error } = await supabaseAuth.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      console.error('Password reset request failed:', {
        message: error.message,
        status: error.status,
        code: error.code,
      });
      return next(
        new AppError(
          'Unable to send a password reset email right now. Please try again later.',
          error.status || 502,
        ),
      );
    }

    res.status(200).json({
      status: 'success',
      message:
        'If that email is registered, a password reset link has been sent.',
    });
  },
);

export const resetPassword: RequestHandler = catchAsync(
  async (req: CustomRequest, res, next) => {
    const password = req.body.password as string | undefined;
    const headerToken = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : undefined;
    const token = headerToken || (req.body.accessToken as string | undefined);

    if (!password || password.length < 8) {
      return next(new AppError('Password must be at least 8 characters', 400));
    }

    if (!token) {
      return next(
        new AppError('Invalid or expired reset link. Please request a new one.', 401),
      );
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) {
      return next(
        new AppError('Invalid or expired reset link. Please request a new one.', 401),
      );
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      data.user.id,
      { password },
    );

    if (updateError) {
      return next(new AppError(updateError.message, updateError.status || 400));
    }

    res.status(200).json({
      status: 'success',
      message: 'Password updated. You can now sign in with your new password.',
    });
  },
);
