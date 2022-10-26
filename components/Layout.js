import Footer from './Nav/Footer';
import Header from './Nav/Header';

export default function Layout({ children, logOutHelper }) {
  return (
    <>
      <Header logOutHelper={logOutHelper} />
      {children}
      <Footer />
    </>
  );
}
