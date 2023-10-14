import { P, P2, Border, DivImg, Div } from "./FriendItemStyled";
import { Link } from "react-router-dom";
import { useDataStore } from "../../Storage/userStorage";

type ChildProps = {
  _id: string;
  userImage: string;
  name: string;
  user: any;
  msg: string;
};
const FriendItem: React.FC<ChildProps> = ({
  _id,
  name,
  userImage,
  user,
  msg,
}) => {
  const friendId = useDataStore((state: any) => state.setData);
  const handleClick = () => {
    friendId(user);
  };

  return (
    <div>
      <Link to="/room" style={{ textDecoration: "none" }}>
        <Div onClick={handleClick}>
          <div>
            <DivImg alt="user" src={userImage} />
          </div>
          <div style={{ width: "100%" }}>
            <P>{name}</P>
            <P2>{msg}</P2>
          </div>
          {/* <div>
            <Button>Follow</Button>
          </div> */}
        </Div>
      </Link>
      <Border />
    </div>
  );
};

export default FriendItem;
