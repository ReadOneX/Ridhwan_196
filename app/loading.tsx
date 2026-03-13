export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-pulse">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="absolute w-full h-full border-8 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
        <span className="text-4xl">🌸</span>
      </div>
      <h2 className="text-2xl font-bold text-pink-500 tracking-wide">Loading Haru Urara's Profile...</h2>
      <p className="text-pink-300 font-medium">Please wait while we fetch the latest data from the stable!</p>
    </div>
  );
}
