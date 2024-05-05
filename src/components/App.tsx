import DaytimeLowtideFinder from './DaytimeLowtideFinder';
import './App.css';

function App() {
  return (
    <div className="">
      <header className="header">
        <h1>Daytime Lowtide Finder</h1>
      </header>
      <main>
        <DaytimeLowtideFinder />
      </main>
      <footer className="footer">
        made by{' '}
        <a href="https://colewillsea.net" target="_blank" rel="noreferrer">
          Cole Willsea
        </a>
      </footer>
    </div>
  );
}

export default App;
