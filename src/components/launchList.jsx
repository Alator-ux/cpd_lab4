import * as d3 from "d3";

function LaunchElement(launch) {
    let onMouseOverCallback = (event) => {
        let launchpad = d3.select(`#i${launch.launchpad}`);
        launchpad.attr("class", "highlightedLaunchpad");

        d3.select("#launchpads").selectAll("path").sort((a, b) => {
            if (a.id == launch.launchpad) {
                return 1
            }

            return -1
        })
    }
    let onMouseLeaveCallback = (event) => {
        const launchpad = d3.select(`#i${launch.launchpad}`)
        launchpad.attr("class", "launchpad")
    }
    return <li className="launchItem"
        key={launch.id}
        onMouseOver={onMouseOverCallback}
        onMouseLeave={onMouseLeaveCallback}
    >
        {launch.name}
    </li>
}

function LaunchList(props) {
    return (
        <aside className="aside" id="launchesContainer">
            <h3>Launches</h3>
            <div id="listContainer">
                <ul>
                    {props.launches.map(launch => {
                        return LaunchElement(launch);
                    })}
                </ul>
            </div>
        </aside>
    )
}

export { LaunchList }