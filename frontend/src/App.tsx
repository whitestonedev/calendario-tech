import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  const baseRoute =
    process.env.NODE_ENV === 'production' ? '/calendario-istepo/' : '/';

  return (
    <Router>
      <Routes>
        <Route path={baseRoute} element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
