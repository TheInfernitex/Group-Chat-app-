import React, { useState, useEffect } from "react";
import io from "socket.io-client";

//connect socket with backend
const socket = io("http://localhost:5000");

const App = () => {
  const [username, setUsername] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // useEffect(() => {
  //   socket.on("received-message", (message) => {
  //     setMessages([...messages, message]);
  //   });
  // }, [messages]);
  useEffect(() => {
    const handleReceivedMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("received-message", handleReceivedMessage);

    return () => {
      socket.off("received-message", handleReceivedMessage);
    };
  }, []);

  const handleSubmit = (e) => {
    //to prevent refresh after starting the chat
    e.preventDefault();
    const messageData = {
      message: newMessage,
      user: username,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    if (newMessage == "") alert("Message cannot be empty!");
    else {
      socket.emit("send-message", messageData);
      setNewMessage("");
    }
  };

  return (
    <>
      <div className="w-screen h-screen bg-gray-100 flex justify-center items-center">
        {chatActive ? (
          <div className="rounded-md w-[94vw] md:w-[80vw] lg:w-[60vw] p-2 ">
            <h1 className="text-center font-bold text-xl my-2 text-gray-700">
              Samvaad.io
            </h1>
            <div className="overflow-scroll h-[80vh] lg:h-[60vh]">
              {messages.map((message, index) => {
                return (
                  <div
                    key={index}
                    className={`flex rounded-md shadow-md my-5 w-fit ${
                      username == message.user && "ml-auto"
                    }`}
                  >
                    <div className="bg-green-400 flex justify-center items-center rounded-l-md">
                      <h3 className="font-bold text-lg px-2">
                        {message.user.charAt(0).toUpperCase()}
                      </h3>
                    </div>
                    <div className="px-2 bg-white rounded-md ">
                      <span className="text-sm">{message.user}</span>
                      <h3 className="font-bold">{message.message}</h3>
                      <h3 className="text-dx text-right">{message.time}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
            <form
              className="flex gap-2 md:gap-4 justify-between"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="Enter your message...."
                className="rounded-md border-2 outline-none px-3 py-2 w-full"
                onChange={(e) => {
                  setNewMessage(e.target.value);
                }}
                value={newMessage}
              ></input>
              <button
                type="submit"
                className="px-3 py-2 bg-green-500 text-white rounded-md font-bold"
              >
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="w-screen h-screen flex justify-center items-center gap-2">
            <input
              type="text"
              name=""
              id=""
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="text-center px-3 py-2 outline-none border-2 rounded-md"
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-3 py-2 rounder-md font-bold"
              onClick={() => {
                username == ""
                  ? alert("username cannot be empty")
                  : setChatActive(true);
              }}
            >
              Start Chat
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
