import DaytimeLowtideFinder from "./DaytimeLowtideFinder";

function App() {


  return (
    <div className="">
      <header className="">
        Daytime Lowtide Finder 
      </header>
      <main>
        <div>This tool tries to find day time low tides so that you can maximize your beach time.</div>
        <div>
          INSTRUCTIONS:
          Find ID for an NOAA tide station near the beach you want to visit
          Filter by "Data Type": "Tide Predictions" https://tidesandcurrents.noaa.gov/map/index.shtml

          Set tide target to filter to the lowest of low tides 
        </div>
        <DaytimeLowtideFinder/>
      </main>
      <footer>
        credits go here
      </footer>
    </div>
  );
}

export default App;
