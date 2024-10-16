
export default function FlagEffect() {

  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

  return (
    <div className="w-full max-w-lg mx-auto relative perspective-1000">
      <div className="animate-wave absolute inset-0 transform-style-preserve-3d">
        <div className="animate-ripple flex justify-center">
          <img
            src={`${REACT_APP_API_URL}/uploads/lirafest-logo.png`}
            alt="LiraFest"
            width={200}
            height={200}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
