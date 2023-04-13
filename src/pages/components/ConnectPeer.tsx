import { useEffect, useState } from "react";
import Peer, { DataConnection } from "peerjs";

interface PeerProps {
  socket: any;
}
const PeerComponent: React.FC<PeerProps> = ({ socket }) => {
  const [peer, setPeer] = useState<Peer>();
  const [connection, setConnection] = useState<DataConnection>();

  useEffect(() => {
    const newPeer = new Peer();
    setPeer(newPeer);

    newPeer.on("open", (id) => {
      console.log(`Connected to PeerJS with ID: ${id}`);
    });

    newPeer.on("connection", (conn) => {
      console.log("Peer connected:", conn.peer);
      setConnection(conn);
    });

    return () => {
      if (peer) {
        peer.destroy();
      }
    };
  }, [setPeer]);

  // Render your PeerJS component here.
  return <></>;
};

export default PeerComponent;
