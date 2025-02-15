import HeroSection from '../../components/sections/HeroSection';
import BaseTemplate from '../../components/template/BaseTemplate';
// import useScreenSize from '../../hooks/useScreenSize';

function Home() {
  // const screenSize = useScreenSize();

  return (
    <BaseTemplate>
      <div className={`container mx-auto `}>
        <HeroSection />{' '}
      </div>
    </BaseTemplate>
  );
}

export default Home;
