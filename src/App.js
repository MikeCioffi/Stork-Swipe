import './App.css';

function App() {
  return (
    <div className="flex h-full w-full justify-center">
      <div className="mt-12 h-1/4 w-3/4 md:w-1/2 xl:w-1/4 flex shadow-lg  justify-center flex-row">
        <div className='w-1/12 items-center justify-center flex flex-col'>No</div>
        <div className='w-10/12 justify-center items-center flex flex-col'>
          <h1 className='-mt-4 text-sm'>Name</h1>
          <h3 className='text-5xl'>Victoria</h3>
        </div>
        <div className='w-1/12 items-center justify-center flex flex-col'>Yes</div>
      </div>
    </div>
  );
}

export default App;
