



export default function Completed() {
  return (    
    <div className="relative flex flex-col items-center justify-center min-h-screen custom-background from-blue-800 to-blue-600 px-4 pt-20 sm:pt-2">


      <div className="flex-grow flex flex-col items-center justify-center"> 
      {/* Title */}
      <h1 className="font-brunoAce text-white text-[64px] sm:text-[102px] leading-[78px] sm:leading-[123px] text-center mb-1 sm:mb-20 mt-1 sm:mt-1">
        Goal OS
      </h1>
      
      <h2 className="font-abeeZee text-white text-[14px] sm:text-[18px] leading-[20px] sm:leading-[24px] text-center mb-1 sm:mb-1">
        Don’t be shy, tell us your goal 😉!
      </h2>
      {/* } */}

      <div className="flex flex-col items-center justify-center mt-[5rem] relative">
        <p className="text-white text-center mb-2 font-abeeZee text-[20px]">
          🥳 Process Completed 🥳
        </p>
        
        <p className="text-white text-center mb-4 font-abeeZee text-[15px]">
          Please check your Notion app in 5-10 minutes!
        </p>
      </div>

      

      </div>

      <footer className="pb-10 sm:mt-16 flex items-center justify-center gap-6 ">
          <img src="/images/notion-logo.svg" alt="Notion Logo" className="w-24 h-24" />
          <img src="/images/by.svg" alt="Third Logo" className="w-4 h-4" />          
          <img src="/images/notiontemplateslogo.svg" alt="Notion Templates Logo" className="w-24 h-24" />
        </footer>
    </div>
  );
}
