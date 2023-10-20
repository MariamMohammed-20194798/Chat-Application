import { useEffect, useState } from "react";
import { P, P2, Border, DivImg, Div } from "./FriendItemStyled";
import { Link } from "react-router-dom";
import { useDataStore } from "../../Storage/userStorage";
import { useLastmsgStore } from "../../Storage/lastMsgStore";
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
  // const [lastMsg, setLastMsg] = useState("");
  const friendId = useDataStore((state: any) => state.setData);
  const lastMsg = useLastmsgStore((state: any) => state.lastMsg);
  const handleClick = () => {
    friendId(user);
  };
  useEffect(() => {
    const fetchLastMsg = async () => {
      try {
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    fetchLastMsg();
  }, [friendId]);

  return (
    <div>
      <Link to="/room" style={{ textDecoration: "none" }}>
        <Div onClick={handleClick}>
          <div>
            <DivImg alt="user" src={userImage} />
          </div>
          <div style={{ width: "100%" }}>
            <P>{name}</P>
            <P2>Hey</P2>
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
