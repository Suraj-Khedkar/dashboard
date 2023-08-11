const svgElement = document.getElementById("mySvg");
const currentPlace = document.querySelector(".current-place");
const allPath = document.querySelectorAll(".map path");
const hoverDetails = document.querySelector(".hover-details");
const resetButton = document.getElementById("resetButton");

async function fetchStateData(statecode) {
    try {
        const response = await fetch("state_data.json");
        const data = await response.json();
        return data[statecode];
    } catch (error) {
        console.error("Error fetching state data:", error);
        return null;
    }
}
const originalViewBox = svgElement.getAttribute("viewBox");
allPath.forEach(element => {
    document.addEventListener("DOMContentLoaded", async function(){
        const currentState = element.getAttribute("title");
        const stateInfo = await fetchStateData(currentState);
        const {color} = stateInfo || {color : "black"};
        element.style.fill = color;
    });
    
    element.addEventListener("mouseenter", async function(event) {
        const currentState = element.getAttribute("title");
        currentPlace.innerText = currentState;
        const stateInfo = await fetchStateData(currentState);
        const { districts, villages } = stateInfo || { districts: "N/A", villages: "N/A" };
        hoverDetails.innerText = currentState + "\nDistricts: " + districts + "\nVillages: " + villages;
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        hoverDetails.style.display = "block";
        hoverDetails.style.left = `${mouseX + 10}px`;
        hoverDetails.style.top = `${mouseY + 10}px`;
    });
    
    element.addEventListener("mouseleave", function() {
        hoverDetails.style.display = "none";
    });
    element.addEventListener("click", function(event) {
        svgElement.style.pointerEvents  = "none";
        const bbox = event.target.getBBox();
        console.log(event.target);
        const viewBoxX = bbox.x - 10; 
        const viewBoxY = bbox.y - 10; 
        const viewBoxWidth = bbox.width + 20; 
        const viewBoxHeight = bbox.height + 20;
        element.style.strokeWidth = 1;
    
        svgElement.setAttribute("viewBox", `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`);
    });
    resetButton.addEventListener("click", function() {
        svgElement.style.pointerEvents  = "auto";
        element.style.strokeWidth = 0;
        svgElement.setAttribute("viewBox", originalViewBox);
      });
});


