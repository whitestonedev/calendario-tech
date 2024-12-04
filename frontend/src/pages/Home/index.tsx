import BaseTemplate from '../../components/template/BaseTemplate';
import useScreenSize from '../../hooks/useScreenSize';

function Home() {
  const screenSize = useScreenSize();

  return (
    <BaseTemplate>
      <div
        className={`container mx-auto  ${screenSize.isMobileView ? 'mt-40' : 'mt-24'}`}
      ></div>
    </BaseTemplate>
  );
}

export default Home;
