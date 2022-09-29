import React, { useContext, useEffect } from "react";
import { Col, ListGroup, Row } from "react-bootstrap";
import { AppContext } from "../context/appContext";
import useAuthStore from "../store/authStore";
import { IUser } from "../type/types";
import { BACKEND } from "../url";
import "./SideBar.css";

const SideBar = () => {
  const { userProfile } = useAuthStore() as any;
  const {
    socket,
    setMembers,
    members,
    setCurrentRoom,
    setRooms,
    privateMemberMsg,
    rooms,
    setPrivateMemberMsg,
    currentRoom,
  } = useContext(AppContext);

  const joinRoom = (room: any, isPublic = true) => {
    if (!userProfile) {
      return alert("Please login");
    }
    if (currentRoom && currentRoom.length >  0 ) {
      socket.emit("leave-room", currentRoom, userProfile.name)
    }
    socket.emit("join-room", room, currentRoom, userProfile.name);
    
    setCurrentRoom(room);

    if (isPublic) {
      setPrivateMemberMsg(null);
    }
  };
  const getRooms = () => {
    fetch(`${BACKEND}/api/rooms`)
      .then((res) => res.json())
      .then((data) => setRooms(data));
  };
  const orderIds = (id1: any, id2: any) => {
    if (id1 > id2) {
      return id1 + "-" + id2;
    } else {
      return id2 + "-" + id1;
    }
  };

  const handlePrivateMemberMsg = (member: any) => {
    setPrivateMemberMsg(member);
    const roomId = orderIds(userProfile._id, member._id);
    joinRoom(roomId, false);
  };

  useEffect(() => {
    if (userProfile) {
      //setCurrentRoom("general");
      getRooms();
      //socket.emit("join-room", "general",undefined, userProfile.name);
      
      socket.emit("new-user");
    }
  }, []);

  socket.off("new-user").on("new-user", (payload: any) => {
    //console.log(payload);
    setMembers(payload);
  });

  

  if (!userProfile) {
    return <></>;
  }

  return (
    <>
      <h2>Available rooms</h2>
      <ListGroup>
        {rooms.map((room: any, idx: number) => (
          <ListGroup.Item
            key={idx}
            onClick={() => joinRoom(room)}
            active={room === currentRoom}
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {room}{" "}
            {currentRoom !== room && (
              <span className="badge rounded-pill bg-primary">
                {/* {userProfile.newMessages[room]} */}
              </span>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <br />
      <h2>Members</h2>
      {members.map((member: IUser) => (
        <ListGroup.Item
          key={member._id}
         
          active={privateMemberMsg?._id === member?._id}
          className="member-card"
          onClick={() => handlePrivateMemberMsg(member)}
          disabled={member._id === userProfile._id}
        >
          <Row>
            <Col xs={2} className="member-status">
              <img
                src={"https://source.unsplash.com/1600x900/?football"}
                alt="prfile-pic"
                className="member-status-img"
              />
              {member.status === "online" ? (
                <i className="fas fa-circle sidebar-online-status"></i>
              ) : (
                <i className="fas fa-circle sidebar-offline-status"></i>
              )}
            </Col>
            <Col xs={9}>
              {member.name}
              {member._id === userProfile?._id && " (You)"}
              {member.status === "offline" && " (Offline)"}
              {member.status === "online" && " (active)"}
              {}
              {member._id !== userProfile._id && (
                <button className="btn-chat">Chat</button>
              )}
            </Col>
            <Col xs={1}></Col>
          </Row>
          <br />
        </ListGroup.Item>
      ))}
    </>
  );
};

export default SideBar;
