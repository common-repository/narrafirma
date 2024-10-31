import navigationPane = require("./navigationPane");
import PanelBuilder = require("panelBuilder/PanelBuilder");
import Project = require("./Project");
import m = require("mithril");
import PanelSetup = require("./PanelSetup");
import ClientState = require("./ClientState");

"use strict";

// For tracking what page the application is on
let currentPageID = null;
let currentPageSpecification = null;
let currentPage;

let panelBuilder: PanelBuilder;

let project: Project;
let clientState: ClientState;

function stringBeyond(aString: string, beyondWhat: string) {
    if (beyondWhat !== "") {
        return aString.split(beyondWhat).pop();
    } else {
        return aString;
    }
}

const PageDisplayer: any = {
    controller: function(args) {
        ;
    },
    
    view: function(controller, args) {
        let contentsDiv;

        // Setting the hash may trigger another call to the showPage function eventually, but as the new page will already be set, it should not loop further
        clientState.updateHashIfNeededForChangedClientState();
        
        if (!currentPageID) {
            contentsDiv = m("div", "Starting up...");
        } else {
            // Create the display widgets for this page
            try {
                const parts = [];
                const pageNameWithoutPrefix = stringBeyond(currentPageSpecification.id, "page_");
                let isSectionPage = currentPageSpecification.section === pageNameWithoutPrefix;
                if (currentPageSpecification.section === "dashboard" || currentPageSpecification.section === "administration") isSectionPage = false;

                if (isSectionPage) {
                    const sectionImageURL = "./images/section_" + currentPageSpecification.section + ".png";
                    const imagePart = m("img", {
                        class: "narrafirma-section-page-image",
                        alt: currentPageSpecification.section + " section image",
                        src: sectionImageURL});
                    parts.push(imagePart);
                } else {
                    parts.push(m("div.narrafirma-page-name", currentPageSpecification.displayName));
                }

                parts.push(panelBuilder.buildPanel(currentPageID, project.projectIdentifier));
                contentsDiv = m("div", {"class": "narrafirma-" + currentPageID}, parts);

            } catch (e) {
                console.log("ERROR: When trying to view page", currentPageID, e);
                // TODO: Translate
                // alert("Something when wrong trying to create this page");
                contentsDiv = m("div", "PROBLEM: Failed to view page: " + currentPageID);
            }
        }

        // for all of these optional displays
        // if nothing is stored for the option, show the thing (default to support for new user)

        // show or hide explanations of pages on section-dashboard pages
        const showPageExplanations = project.tripleStore.queryLatestC(project.projectIdentifier, "projectOptions_showPageExplanations");
        const explanationsExtraClass = (showPageExplanations === undefined || showPageExplanations === "yes") ? ".showPageExplanations" : "";

        // show or hide page category icons on section-dashboard pages
        const showPageCategoryIcons = project.tripleStore.queryLatestC(project.projectIdentifier, "projectOptions_showPageCategoryIcons");
        const iconsExtraClass = (showPageCategoryIcons === undefined || showPageCategoryIcons === "yes") ? ".showPageCategoryIcons" : "";

        // show or hide tips
        const showTips = project.tripleStore.queryLatestC(project.projectIdentifier, "projectOptions_showTips");
        const tipsExtraClass = (showTips === undefined || showTips === "yes") ? ".showTips" : "";

        // show or hide read-only warning
        const readOnlyWarningExtraClass = project.readOnly ? ".showReadOnlyWarning" : "";

        return m("div.pageContents" + explanationsExtraClass + iconsExtraClass + tipsExtraClass + readOnlyWarningExtraClass, {key: "pageContents"}, contentsDiv);
    }
};

// Call this once at the beginning of the application
export function configurePageDisplayer(thePanelBuilder: PanelBuilder, theProject, theClientState) {
    panelBuilder = thePanelBuilder;
    project = theProject;
    clientState = theClientState;
    
    m.mount(document.getElementById("pageDiv"), PageDisplayer);
}

export function showPage(pageID, forceRefresh = false, isRedrawAlreadyQueued = false) {
    if (!pageID) pageID = PanelSetup.startPage();
    if (currentPageID === pageID && !forceRefresh) {
        return;
    }

    let pageSpecification;
    try {
        pageSpecification = panelBuilder.getPageSpecificationForPageID(pageID);
    } catch (e) {
        console.log("Problem finding pageSpecification for", pageID);
    }
    
    let badPage = null;

    if (clientState.leavingPageCallback()) clientState.leavingPageCallback()();
    
    // Assume that if we have a panel specification for a page that it is OK to go to it
    if (!pageSpecification || pageSpecification.displayType !== "page") {
        console.log("no such page", pageID);
        alert("No such page: " + pageID);
        badPage = pageID;
        // Put back the hash if there was a valid one there already
        if (currentPageID !== null && currentPageID !== pageID) {
            pageID = currentPageID;
        } else {
            pageID = PanelSetup.startPage();
        }
        // clientState.updateHashIfNeededForChangedClientState();
        try {
            pageSpecification = panelBuilder.getPageSpecificationForPageID(pageID);
        } catch (e) {
            console.log("Problem finding pageSpecification for", pageID);
        }
    }
 
    // Just going to assume we will be redrawing later via Mithril...
    
    // Make sure the hash is pointing to this page if this is not a forced refresh
    if (currentPageID !== pageID || badPage) {
        currentPageID = pageID;
        currentPageSpecification = pageSpecification;
        clientState.pageIdentifier(currentPageID);
    }

    navigationPane.setCurrentPageSpecification(pageID, pageSpecification);

    if (!isRedrawAlreadyQueued) {
        try {
            m.redraw();
        } catch (e) {
            console.log("ERROR: When trying to redraw page", currentPageID, e);
        }
    }
}

export function getCurrentPageID() {
    return currentPageID;
}
