import { SocketProvider } from "./context/socket";
import Chat from "./components/Chat";

import "./App.css";

function App() {
  return (
    <SocketProvider>
      <Chat />
    </SocketProvider>
  );
}

export default App;
