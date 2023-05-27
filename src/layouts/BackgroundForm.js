// Images
import loginImg from "../assets/login.jpg";

export default function BackgroundForm({ children }) {
  return (
    <div className="relative w-full h-screen">
      <div
        className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-zinc-900/60"
        style={{ backgroundImage: `url(${loginImg})`, zIndex: -1 }}
      ></div>
      <div className="flex items-center justify-center h-full">{children}</div>
    </div>
  );
}