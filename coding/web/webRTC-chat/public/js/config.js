const turnConfig = {
  iceServers: [
    { urls: ["stun:fr-turn1.xirsys.com"] },
    {
      username:
        "NGxh2egoDXcmcE-zxIo4hGbLtsTDhCcWFjiTbo72jtFW1CH4tCyoLB4QfrM0jfKvAAAAAGHJ6PZ0dGV0cmFmb24=",
      credential: "9221526-6731-11ec-9122-0242ac12000",
      urls: [
        "turn:fr-turn1.xirsys.com:80?transport=udp",
        "turn:fr-turn1.xirsys.com:3478?transport=udp",
        "turn:fr-turn1.xirsys.com:80?transport=tcp",
        "turn:fr-turn1.xirsys.com:3478?transport=tcp",
        "turns:fr-turn1.xirsys.com:443?transport=tcp",
        "turns:fr-turn1.xirsys.com:5349?transport=tcp"
      ],
    },
  ],
};
