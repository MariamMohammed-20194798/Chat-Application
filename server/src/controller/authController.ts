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
    const { email, username, password } = req.body;

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
      },
    });

    if (error) {
      console.error('Supabase signup error:', error);

      if (error.code === 'over_email_send_rate_limit' || error.status === 429) {
        return next(
          new AppError(
            'Too many signup attempts. Please wait a few minutes and try again.',
            429,
          ),
        );
      }

      if (error.status === 0 || error.name === 'AuthRetryableFetchError') {
        return next(
          new AppError(
            'Unable to connect to Supabase. Please check your network or try again later.',
            503,
          ),
        );
      }

      if (error.message.includes('already registered')) {
        return next(new AppError('Duplicate email. Please use another value!', 500));
      }

      return next(new AppError(error.message, 400));
    }

    console.log('Supabase signup successful, user ID:', data.user?.id);

    if (!data.session || !data.user) {
      return next(
        new AppError(
          'Signup successful. Please confirm your email if required by your Supabase project settings.',
          201,
        ),
      );
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
  const { email, password } = req.body;

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
