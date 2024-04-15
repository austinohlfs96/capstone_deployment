
import React, {useEffect, useState} from "react";
import { Segment, Image, Grid, Header } from "semantic-ui-react";
import Head from "./Header";


const LandingPage = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Activate the animation when the component mounts
    setIsActive(true);
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      const segments = document.querySelectorAll('.slide-in');

      segments.forEach(segment => {
        const slideInAt = (window.scrollY + window.innerHeight) - segment.clientHeight / 20;
        const segmentBottom = segment.offsetTop + segment.clientHeight;
        const isHalfShown = slideInAt > segment.offsetTop;
        const isNotScrolledPast = window.scrollY < segmentBottom;

        if (isHalfShown && isNotScrolledPast) {
          segment.classList.add('active');
        } else {
          segment.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    const firstSegment = document.querySelector('.slide-in');
    if (firstSegment) {
      firstSegment.classList.add('active');
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const burtonPipe = document.querySelector('.burtonPipe'); // Target element
    const offset = 250; // Adjust offset for desired appearance

    const handleBurtonPipeVisibility = () => {
      if (!burtonPipe) return; // Check if element exists

      const scrollPosition = window.scrollY;
      const burtonPipePosition = burtonPipe.offsetTop;

      if (scrollPosition > burtonPipePosition - window.innerHeight + offset) {
        burtonPipe.classList.add('visible');
      } else {
        burtonPipe.classList.remove('visible'); // Hide until triggered
      }
    };

    window.addEventListener('scroll', handleBurtonPipeVisibility);

    return () => {
      window.removeEventListener('scroll', handleBurtonPipeVisibility);
    };
  }, []);
  return (
    <div>
      <Head />
        <div className={`animation-container ${isActive ? 'active' : ''}`} style={{ position: "relative", marginTop: "10px" }}>
          <Image src="/AESIRCarve.png" fluid centered />
          <div className="text-overlay" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
            <Segment inverted style={{ backgroundColor: 'transparent', padding: '2em', display: 'flex', flexFlow: 'wrap', justifyContent: 'space-around', alignItems: 'flex-end' }}>
              <h1 style={{ fontSize: '9vw', color: '#fff', marginBottom: '2em', lineHeight: '0', display: 'contents', backgroundColor: 'red'}}>
                <Image src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Valknut.svg/1200px-Valknut.svg.png' size='tiny' style={{width: "9vw", height: "auto"}}/>
                ÆSIR Speed Techs
              </h1>
              <p style={{ fontSize: '5vw', color: '#fff', lineHeight: '12.5', color: 'black', fontStyle: 'italic', fontWeight: 'bold'}}>GO FAST TAKE CHANCES!</p>
            </Segment>
          </div>
        </div>

      {/* </Segment> */}
      <div style={{marginTop: "3vw"}}>
      <Segment className="slide-in"  style={{ 
        background: 'rgba(16, 51, 78, 0.6)',
        borderRadius: '0px',
        marginRight: '20px',
        marginLeft: '20px',
        marginTop: "25px",
        height: 'auto',
        display: 'inline-block'
         }}>
        <Image
          src="EileenPodium.jpg"
          size="medium"
          floated="left"
        />
        <h2 style={{fontSize: "3vw", textAlign: "center", color: "white"}}>Mission</h2>
        <h4 style={{fontSize: "2.6vw", textAlign: "center", color: "white"}}>
        At Æsir Speed Techs, our mission is to elevate the winter sports competition by providing unmatched tuning services that empower athletes and coaches to achieve their highest potential on the slopes. We are committed to excellence, constantly pushing the boundaries of performance tuning through innovation and precision. Our goal is to be the trusted partner for winter sports enthusiasts, delivering quality tuning that not only meets but exceeds the rigorous demands of competitive skiing and snowboarding. With a passion for the sport and a dedication to craftsmanship, we strive to enhance the joy and success of every individual who chooses Æsir Speed Techs.</h4> 
          </Segment>
          
          <Segment className="slide-in" style={{ 
        background: 'rgba(16, 51, 78, 0.6)',
        borderRadius: '0px',
        marginLeft: '20px',
        marginRight: '20px',
        marginTop: "70px",
        height: 'auto',
        display: 'inline-block'
         }}>
          <Image
          src="/JRBaseGrind1.jpg"
          size="medium"
          floated="right"
        />
        <h2 style={{fontSize: "3vw", textAlign: "center", color: "white"}}>Premier Services</h2>
          <h4 style={{fontSize: "2.6vw", textAlign: "center", color: "white"}}>Discover a new level of performance with Æsir Speed Techs' premier tuning services. Our offerings are meticulously crafted to cater to the unique needs of athletes and coaches, setting us apart as the premier destination for professional ski and snowboard tuning. We utilize cutting-edge equipment and high-end products to ensure that every tuning process is executed with precision.</h4> 
          </Segment>
          <Segment className="slide-in" style={{ 
        background: 'rgba(16, 51, 78, 0.6)',
        borderRadius: '0px',
        marginRight: '20px',
        marginLeft: '20px',
        marginTop: "70px",
        height: 'auto'
         }}>
        
        <h2 style={{fontSize: "3vw", textAlign: "center", color: "white"}}>Our Crew</h2>
        <h4 style={{fontSize: "2.6vw", textAlign: "center", color: "white"}}>Our success at Æsir Speed Techs is driven by the expertise and passion of our professional employees and technicians. With a dedicated team of skilled individuals who share a genuine love for winter sports, we take pride in delivering unparalleled tuning experiences. Our technicians are not just experts in their field; they are enthusiasts who understand the intricacies of competitive skiing and snowboarding.
        </h4>
        <Image
          src="/AESIRCrewRev.jpg"
          size="large"
          centered
        />
      </Segment>
     
      <div className="burtonPipe">
      <Image
        src="https://www.snowboarder.com/.image/ar_16:9%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:eco%2Cw_1200/MTk2MzUxNDI1MzY0ODMwMTQ3/modified-pipe.jpg"
        size="large"
        centered
      />
      </div>
    </div>
    </div>
  );
};

export default LandingPage;

