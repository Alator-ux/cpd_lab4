import {LaunchList} from "./launchList";
import {Map} from "./map";
import {useEffect, useState} from "react";
import {SpaceX} from "../api/spacex";

function App(){

    const [launches, setLaunches] = useState([]);
    const [launchpads, setLaunchpads] = useState([]);
    const spacex = new SpaceX();
    useEffect(()=>{
        spacex.launches().then(data =>{
            setLaunches(data)
        })
        spacex.launchpads().then(data => {
            setLaunchpads(data)
        })
        console.log('Haha')
    },[])
    let map = new Map({
        width: 1000,
        height: 600,
        margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 100
        },
    });

    console.log('Hihi')
    return(
        <main className='main'>
            <LaunchList launches={launches} />
            <map.Map launchpads={launchpads} highlightLaunchpadId={undefined} />
        </main>
    )
}

export {App};
