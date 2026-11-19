import Header from "../Landing_page/Header";
import Home from './Home';
import HowItWorks from "./How_It_works";
import Specialists from "./Specialists";
import ForClinics from ".//For_clinics";
import Footer from "./Footer";

function Home_page() {
    return (
        <div>
            <Header/>
            <Home />
            <HowItWorks />
            <Specialists />
            <ForClinics />
            <Footer />
        </div>
    );
}

export default Home_page;
