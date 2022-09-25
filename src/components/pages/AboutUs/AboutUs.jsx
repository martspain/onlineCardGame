import React from "react";
import martin from '../../../assets/images/Us/martinEspana.png'
import sofia from '../../../assets/images/Us/sofiaRueda.png'
import laura from '../../../assets/images/Us/lauraTamath.png'
import linkedIn from '../../../assets/images/Us/link.png'
import './AboutUs.scss'

const AboutUs = () => {
    return(
        <div className="aboutUsContainer">
            <div className="title">About
                <div class="title2">Us</div>
            </div>
            <div className="picturesContainer">
                <div className="person">
                    <img src={sofia} id="picture1" alt="SofiaRueda" />
                    <h1>Sofia Rueda</h1>
                    <div className="descContainer">
                        <div className="description">Front-end developer</div>
                        <div className="description">Game designer/developer</div>
                    </div>
                    <a href="https://www.linkedin.com/in/sofia-rueda-712270179/">
                        <img src={linkedIn} id="link" alt="linkedIn" width="50px" />
                    </a>
                </div>
                <div className="person">
                    <img src={martin} id="picture2" alt="MartinEspaña" />
                    <h1>Martín España</h1>
                    <div className="descContainer">
                        <div className="description">Front-end developer</div>
                        <div className="description">Game designer/developer</div>
                    </div>
                    <a href="https://www.linkedin.com/in/martspain/">
                        <img src={linkedIn} id="link" alt="linkedIn" width="50px" />
                    </a>
                </div>
                <div className="person">
                    <img src={laura} id="picture1" alt="LauraTamath" />
                    <h1>Laura Tamath</h1>
                    <div className="descContainer">
                        <div className="description">Front-end developer</div>
                        <div className="description">Game designer/developer</div>
                        <div className="description">UX/UI designer</div>
                    </div>
                    <a href="https://www.linkedin.com/in/lauratamath/">
                        <img src={linkedIn} id="link" alt="linkedIn" width="50px" />
                    </a>
                </div>
            </div>
        </div>
    )

}

export default AboutUs