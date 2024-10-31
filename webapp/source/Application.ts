import applicationMessages = require("./nls/applicationMessages");
import buttonActions = require("./buttonActions");
import manageStoryCollection = require("./manageStoryCollection");
import csvImportExport = require("./csvImportExport");
import dialogSupport = require("./panelBuilder/dialogSupport");
import loadAllApplicationWidgets = require("./applicationWidgets/loadAllApplicationWidgets");
import loadAllPanelSpecifications = require("./panelBuilder/loadAllPanelSpecifications");
import navigationPane = require("./navigationPane");
import pageDisplayer = require("./pageDisplayer");
import PanelBuilder = require("./panelBuilder/PanelBuilder");
import PointrelClient = require("./pointrel20150417/PointrelClient");
import Project = require("./Project");
import questionnaireGeneration = require("./questionnaireGeneration");
import surveyCollection = require("./surveyCollection");
import toaster = require("./panelBuilder/toaster");
import translate = require("./panelBuilder/translate");
import m = require("mithril");
import navigationSections = require("./applicationPanelSpecifications/navigation");
import PanelSetup = require("./PanelSetup");
import Globals = require("./Globals");
import versions = require("./versions");
import _ = require("lodash");
import topic = require("./pointrel20150417/topic");

"use strict";

// TODO: Add page validation

const narrafirmaProjectPrefix = "NarraFirmaProject-";
const loadingBase = "js/applicationPanelSpecifications/";

class Application {
    private journalIdentifier: string;
    private projectIdentifier: string;
    private userIdentifier: string;
    private readOnly: boolean = false;
        
    /*
    export function project() {
        return _project;
    }
    */
    
    private lastServerError: string = "";
    
    // The runningAfterIdle falg is used to limit redraws for new project messages until after initial set recevied
    private runningAfterInitialIdle: boolean = false;
    
    private pendingRedraw = null;
    
    // For building panels based on field specifications
    private panelBuilder: PanelBuilder;
    
    private updateHashTimer = null;
    
    constructor() {
        this.panelBuilder = new PanelBuilder(this);
    }
    
    // TODO: Think more about how to integrate updatedServerStatus this with Mithril
    updateServerStatus(status, text) {
        // The serverStatusPane may be created only after we start talking to the server
        // if (!serverStatusPane) return;
        
        const nameDiv = document.getElementById("narrafirma-name");
        if (!nameDiv) return;
        
        // TODO: Translate
        
        let statusText = "Version: " + versions.narrafirmaApplication;
        statusText += " Project: " + Globals.project().journalIdentifier.substring(narrafirmaProjectPrefix.length) + "; Server status: (" + status + ") " + text;
    
        if (status === "ok") {
            nameDiv.className = "narrafirma-serverstatus-ok";
            this.lastServerError = "";
        } else if (status === "waiting") {
            if (this.lastServerError) {
                // TODO: Translate
                nameDiv.className = "narrafirma-serverstatus-waiting-last-error";
                statusText += "\n" + "Last error: " + this.lastServerError;
            } else {
                nameDiv.className = "narrafirma-serverstatus-waiting";
            }
        } else if (status === "failure" || status === "failure-loss") {
            nameDiv.className = "narrafirma-serverstatus-failure";
            this.lastServerError = text;
            console.log("updateServerStatus failure", text);
            if (status === "failure-loss") {
                // Very serious error with data loss -- alert the user
                if (this.readOnly) {
                    nameDiv.className = "narrafirma-serverstatus-ok";
                    this.lastServerError = "Read-only OK";
                } else {
                    toaster.toast("Server lost recent change:\n" + text);
                }
            }
        } else {
            console.log("Unexpected server status", status);
            nameDiv.className = "narrafirma-serverstatus-unexpected";
            console.log("updateServerStatus unexpected", text);
        }
        
        nameDiv.title = statusText;
        Globals.clientState().serverStatus(nameDiv.className);
        Globals.clientState().serverStatusText(statusText);
        // TODO: Need to make tooltip text ARIA accessible; suggestion in tooltip docs on setting text in tab order
        // statusTooltip.set("label", statusText); 
        
        // serverStatusPane.set("content", statusText);
    }
    
    // dispatch the button click
    buttonClicked(panelBuilder: PanelBuilder, model, fieldSpecification, value) {
        let functionName = fieldSpecification.id;
         if (fieldSpecification.displayConfiguration) {
             if (_.isString(fieldSpecification.displayConfiguration)) {
                 functionName = fieldSpecification.displayConfiguration;
             } else {
                 functionName = fieldSpecification.displayConfiguration.action;
             }
         }
         
         const actualFunction = buttonActions[functionName];
         if (!actualFunction) {
            const message = "Unfinished handling for: " + fieldSpecification.id + " with functionName: " + functionName;
             console.log(message, model, fieldSpecification, value);
             alert(message);
         } else {
             actualFunction(model, fieldSpecification, value);
         }
    }
    
    // Panel builder "functionResult" components will get routed through here to calculate their text.
    calculateFunctionResultForGUI(panelBuilder: PanelBuilder, model, fieldSpecification, functionName): any {

        function validationErrorMessage(itemID, checkName, checkType = false, checkOptions = false, checkTrimming = false) {
            if (!itemID) return null;
            let success = false;
            if (checkName) {
                success = buttonActions.checkThatItemHasShortName(itemID);
                if (!success) return ["You must enter a short name for this item."];
                success = buttonActions.checkThatItemHasShortNameWithNoForwardSlashInIt(itemID);
                if (!success) return ["Short names cannot have forward slashes (/) in them."]
            }
            if (checkType) {
                success = buttonActions.checkThatQuestionHasType(itemID);
                if (!success) return ["You must enter a question type for this item."];
            }
            if (checkOptions) {
                success = buttonActions.checkThatItemHasOptionListIfRequired(itemID);
                if (!success) return ["You must enter at least two options for this type of question."];
            }
            if (checkTrimming) {
                success = buttonActions.checkThatItemOptionsHaveNoLeadingOrTrailingWhiteSpaceCharacters(itemID);
                if (!success) return ["For this type of question, the answers in your answer list must not have empty spaces in front of or after them."];
            }
            return null;
        }

        const itemID = fieldSpecification.value;

        if (functionName === "isStoryCollectingEnabled") {
            return surveyCollection.isStoryCollectingEnabled();
        } else if (functionName === "requireShortName") {
            return validationErrorMessage(itemID, true);
        } else if (functionName === "requireShortNameAndType") {
            return validationErrorMessage(itemID, true, true);
        } else if (functionName === "requireShortNameTypeOptionsAndTrimming") { 
            return validationErrorMessage(itemID, true, true, true, true);
        } else {
            console.log("TODO: calculateFunctionResultForGUI ", functionName, fieldSpecification);
            return "calculateFunctionResultForGUI UNFINISHED: " + functionName + " for: " + fieldSpecification.id;
        }
    }
        
    setupGlobalFunctions() {
        // Set up global function used by section dashboard links
        
        window["narrafirma_openPage"] = (pageIdentifier) => {
            if (!pageIdentifier) return;
            if (buttonActions.checkForValidationErrors()) return;

            Globals.clientState().pageIdentifier(pageIdentifier);
            Globals.clientState().updateHashIfNeededForChangedClientState();
            // Page displayer will handle cases where the hash is not valid and also optimizing out page redraws if staying on same page
            pageDisplayer.showPage(Globals.clientState().pageIdentifier());
            // document.body.scrollTop = 0;
            // document.documentElement.scrollTop = 0;
            window.scrollTo(0, 0);
        };

        window["narrafirma_logoutClicked"] = () => {
            buttonActions.logoutButtonClicked();
        };
        
        window["narrafirma_loginClicked"] = () => {
            buttonActions.loginButtonClicked();
        };
        
        window["narrafirma_helpClicked"] = (pageIdentifier) => {
            buttonActions.helpButtonClicked();
        };
    }
    
    // The main starting point of the application
    public initialize() {
        console.log("=======", new Date().toISOString(), "application.initialize() called");
        
        // TODO: Translate
        document.getElementById("pleaseWaitDiv").innerHTML = "Retrieving user information from server; please wait...";

        // Cast to silence TypeScript warning about use of translate.configure
        (<any>translate).configure({}, applicationMessages.root);
        
        Globals.clientState().initialize();
    
        this.setupGlobalFunctions();
        
        // mount Mithril dialog support now, as it may be needed in choosing a project
        dialogSupport.initialize();
        
        // Throwaway single-use pointrel client instance which does not access a specific journal and for which polling is not started
        const singleUsePointrelClient = new PointrelClient("/api/pointrel20150417", "unused", {});
        singleUsePointrelClient.getCurrentUserInformation((error, response) => {
            if (error) {
                console.log("error", error, response);
                document.getElementById("pleaseWaitDiv").style.display = "none";
                document.getElementById("pageDiv").innerHTML = "Problem talking to server. Please contact your NarraFirma administrator.";
                document.getElementById("pageDiv").style.display = "block";
                alert("Something went wrong determining the current user identifier.");
                return;
            }
            console.log("initialize response", response);
            let userIdentifier = response.userIdentifier;
            if (userIdentifier === undefined || userIdentifier === null || userIdentifier === false) {
                userIdentifier = "anonymous";
            }  
            this.userIdentifier = userIdentifier;
            const projects = [];
            for (let key in response.journalPermissions) {
                if (!_.startsWith(key, narrafirmaProjectPrefix)) continue;
                const permissions = response.journalPermissions[key];
                if (!permissions.hasOwnProperty("archived") || !permissions.archived) {
                    projects.push({
                        id: key,
                        name: key.substring(narrafirmaProjectPrefix.length),
                        read: permissions.read,
                        write: permissions.write,
                        archived: false,
                        // in node.js this is called "administrate"; in WordPress it is called "admin"
                        admin: permissions.admin || permissions.administrate
                    });
                }
            }
            
            if (!projects.length) {
                document.getElementById("pleaseWaitDiv").style.display = "none";
                let recoveryText = "Please contact your NarraFirma project administrator.";
                let loginText = "";
                if (this.userIdentifier === "anonymous") {
                    recoveryText = "Please try logging in.";
                    loginText = this.loginLink();
                }
                document.body.innerHTML += '<br><b>No projects. The NarraFirma application cannot run.</b> ' + recoveryText + " " + loginText;
                alert("There are no projects accessible by the current user (" + this.userIdentifier + "). " + recoveryText);
                return;
            }
            
            this.chooseAProjectToOpen(response.userIdentifier, projects);

            // for testing field updating
            // setInterval ( ()=> { m.redraw(); console.log("redraw", new Date().toISOString())}, 3000);
        });
    }
    
    chooseAProjectToOpen(userIdentifierFromServer, projects) {
        // Initialize toaster
        toaster.createToasterWidget("toasterDiv");
        
        loadAllApplicationWidgets(PanelBuilder);
        
        document.getElementById("pleaseWaitDiv").style.display = "none";
        
        const userCredentials = {
            userIdentifier: this.userIdentifier
        };
        
        const projectIdentifierSupplied = Globals.clientState().projectIdentifier();
        console.log("projectIdentifierSupplied", projectIdentifierSupplied);
        
        if (projectIdentifierSupplied) {
            // TODO: Could put up project chooser if the supplied project is invalid...
            this.openProject(userCredentials, narrafirmaProjectPrefix + projectIdentifierSupplied, projects);
        } else {
            // TODO: Translate
            const columns = {name: "Project name", id: "Project journal", write: "Editable"};
            // TODO: Only allow new project button for admins
            let isNewAllowed = false;

            let loginOrOutLink;
            let message;
            if (this.userIdentifier === "anonymous") {
                message = "Please select a NarraFirma project to work on - or ";
                loginOrOutLink = m("a", {href: this.loginLink("href"), title: "Login"}, "log in");
            } else {
                message = "Hello " + this.userIdentifier + ". Please select a NarraFirma project to work on - or "
                loginOrOutLink = m("a", {href: this.logoutLink("href"), title: "Logout"}, "log out");
            }
            const prompt = m("div", [m("span", message), loginOrOutLink ? loginOrOutLink : [], m("span", ".")]);

            const nonArchivedProjects = [];
            projects.forEach((project) => {
                if (!project.hasOwnProperty("archived") || !project.archived) {
                    nonArchivedProjects.push(project);
                }
            })

            dialogSupport.openListChoiceDialog(null, nonArchivedProjects, columns, "NarraFirma Projects", prompt, isNewAllowed, (projectChoice) => {
                if (!projectChoice) return;
                
                this.projectIdentifier = projectChoice.id;
                if (!this.projectIdentifier) return;
                
                if (projectChoice.isNew) {
                    Globals.clientState().projectIdentifier(this.projectIdentifier);
                    this.projectIdentifier = narrafirmaProjectPrefix + this.projectIdentifier;
                    this.journalIdentifier = this.projectIdentifier; 
                    alert("About to make project: " + this.projectIdentifier);
                    this.makeNewProject();
                    return;     
                } else {
                    Globals.clientState().projectIdentifier(this.projectIdentifier.substring(narrafirmaProjectPrefix.length));
                }
    
                this.openProject(userCredentials, this.projectIdentifier, projects);
            });
            
            // Because we are opening a dialog at startup, not caused by a user event, we need to tell Mithril to redraw.
            // Safari 5 seems to sometimes get the event sequence wrong at startup, adding 100ms delay to help ensure the redraw is queued after this event is entirely done
            setTimeout(m.redraw, 100);
        }
    }

    loginLink(hrefOrLink = "link") {
        const isWordPressAJAX = !!window["ajaxurl"];
        let loginURL;
        if (isWordPressAJAX) {
            loginURL = "wordpress/wp-login.php";
        } else {
            loginURL = "login";
        }
        if (hrefOrLink === "href") {
            return loginURL;
        } else {
            return '<a href="/' + loginURL + '">login</a>';
        }
    }

    logoutLink(hrefOrLink = "link") {
        const isWordPressAJAX = !!window["ajaxurl"];
        let logoutURL;
        if (isWordPressAJAX) {
            logoutURL = "wordpress/wp-login.php?action=logout";
        } else {
            logoutURL = "logout";
        }
        if (hrefOrLink === "href") {
            return logoutURL;
        } else {
            return '<a href="/' + logoutURL + '">logout</a>';
        }
    }
    
    makeNewProject() {
        console.log("add-journal", this.journalIdentifier);
        
        const singleUsePointrelClient = new PointrelClient("/api/pointrel20150417", "unused", {});
        
        singleUsePointrelClient.createJournal(this.journalIdentifier, (error, response) => {
            if (error || !response.success) {
                console.log("Error creating project", this.journalIdentifier, error, response);
                let message = "error";
                if (response) message = response.description;
                if (error) message = error.description;
                toaster.toast("Error: creating project: " + this.journalIdentifier + " :: " + message);
                // location.reload();
            } else {
                console.log("Created project", this.journalIdentifier, response);
                // allProjectsModel.projects.push({name: this.journalIdentifier.substring(narrafirmaProjectPrefix.length)});
                console.log("About to trigger page reload for changed project");

                // Need to call redraw as event changing data was triggered by network
                // and alert has to be AFTER reload or it is not seen
                alert("Created project: " + this.journalIdentifier);
                location.reload();
            }
        });
    }
    
    redrawFromProject() {
        // The tripleStore may not be updated yet, so this redraw needs to get queued for later by the application
        if (this.runningAfterInitialIdle) {
            if (!this.pendingRedraw) {
                this.pendingRedraw = setTimeout(() => {
                    Globals.clientState().redrawingDueToIncomingMessage(true);
                    this.pendingRedraw = null;
                    m.redraw();
                    Globals.clientState().redrawingDueToIncomingMessage(false);
                }, 0);
            }
        }
    }
    
    openProject(userCredentials, projectIdentifier, projects) {            
        document.getElementById("pleaseWaitDiv").style.display = "block";
        
        // TODO: Should this be managed separately?
        this.journalIdentifier = projectIdentifier; 
        
        Globals.project(new Project(this.journalIdentifier, projectIdentifier, userCredentials, this.updateServerStatus.bind(this), this.redrawFromProject.bind(this)));
        
        console.log("openProject", Globals.project());
        
        surveyCollection.setProject(Globals.project());
        
        // TODO: Translate
        document.getElementById("pleaseWaitDiv").innerHTML = "Retrieving project data from server; please wait...";
        
        Globals.project().startup((error) => {
            if (error) {
                document.getElementById("pleaseWaitDiv").style.display = "none";
                // TODO: Sanitize journalIdentifier
                document.body.innerHTML += '<br>Problem connecting to project journal on server for: "<b>' + this.journalIdentifier + '</b>"';
                alert("Problem connecting to project journal on server. Application will not run.");
                return;
            } else {
                projects.forEach((project) => {
                    if (project.id !== projectIdentifier) return;
                    this.readOnly = !project.write;
                    Globals.project().readOnly = this.readOnly;
                    Globals.project().currentUserHasAdminAccess = project.admin;
                    // this.panelBuilder.readOnly = isReadOnly;
                    if (this.readOnly) {
                        toaster.toast(`You have read-only access to this project. 
                            You can make local changes, but they will not be saved to the server 
                            and will be lost when you reload the page.`, "Message", 8000);
                        Globals.project().pointrelClient.suspendOutgoingMessages(true);
                    }
                });
                this.loadApplicationDesign();
            }
        });
    }
    
    loadApplicationDesign() {
        const panelSpecificationCollection = PanelSetup.panelSpecificationCollection();
        Globals.panelSpecificationCollection(panelSpecificationCollection);
        
        // Load the application design
        loadAllPanelSpecifications(panelSpecificationCollection, navigationSections, loadingBase, () => {
            // generateNavigationDataInJSON();
     
            PanelSetup.processAllPanels();
            
            // TODO: Only for creating models once
            //printModels();
            //return;
    
            // Tell the panel builder how to build panels
            this.panelBuilder.setPanelSpecifications(panelSpecificationCollection);
            
            // Tell the panelBuilder what do do if a button is clicked
            this.panelBuilder.setButtonClickedCallback(this.buttonClicked.bind(this));
            
            this.panelBuilder.setCalculateFunctionResultCallback(this.calculateFunctionResultForGUI.bind(this));
    
            // Initialize different Mithril components which will be mounted using m.mount
            // Note that dialogSupport has already been initialized and that component mounted
            navigationPane.initializeNavigationPane(panelSpecificationCollection, this.userIdentifier, this.panelBuilder);
            pageDisplayer.configurePageDisplayer(this.panelBuilder, Globals.project(), Globals.clientState());
    
            // Fill out initial hash string if needed
            Globals.clientState().updateHashIfNeededForChangedClientState();
            
            // TODO: What to do while waiting for data for a project to load from server the first time? Assuming authenticated OK etc.???

            const topicSubscription = topic.subscribe("messageReceived", function() {
                document.getElementById("pleaseWaitDiv").innerHTML = "Retrieving project information from server (" + Globals.project().pointrelClient.messageReceivedCount + "); please wait...";
            });    
            
            // TODO: This assumes we have picked a project, and are actually loading data and have not errored out
            Globals.project().pointrelClient.idleCallback = () => {
                topicSubscription.remove();

                // Now that data is presumably loaded into the Project tripleStore, we can proceed with further initialization
                buttonActions.initialize(Globals.project(), Globals.clientState());
                manageStoryCollection.initialize(Globals.project(), Globals.clientState());
                csvImportExport.initialize(Globals.project());
                 
                // Ensure the pageDisplayer will display the first page
                Globals.clientState().urlHashFragmentChanged(pageDisplayer);
                
                // Update if the URL hash fragment is changed by hand
                window.onhashchange = Globals.clientState().urlHashFragmentChanged.bind(Globals.clientState(), pageDisplayer);
                
                // turn off initial "please wait" display
                document.getElementById("pleaseWaitDiv").style.display = "none";
                document.getElementById("navigationDiv").style.display = "block";
                document.getElementById("pageDiv").style.display = "block";
                
                this.runningAfterInitialIdle = true;
                
                // TODO: Polling for changes by a read-only client should be an option somewhere; hard-coding it for now to reduce server load on NarraFirma.com
                if (this.readOnly) {
                    console.log("Shutting down polling for updates by read-only client");
                    Globals.project().pointrelClient.shutdown();
                    // toaster.toast("Reload the page to see changes for read-only client");
                }
                
                // toaster.toast("Started up!!!");
            };
            
            // From: https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload
            window.addEventListener("beforeunload", (e) => {
                // TODO: IMPORTANT Ensure the current text field if any does the equivalent of a blur to commit its data...
                // TODO: But may not be reliable: http://stackoverflow.com/questions/18718494/will-onblur-event-trigger-when-window-closes
                return null;
                
                /* TODO: Need to check for unsaved changes in any grids
                if (!hasUnsavedChangesForCurrentPage()) return null;
                    
                const confirmationMessage = "You have unsaved changes";
    
                (e || window.event).returnValue = confirmationMessage;     // Gecko and Trident
                return confirmationMessage;  
                */                              // Gecko and WebKit
            });
        });
    }
        
    /* TODO: Check time? Or ensure topic timestamps are set by server?
    // TODO: this is not needed by apps that only use application-specific server APIs directly
    setup() {
        console.log("Using pointrel20141201");
        const currentLocalTimestamp = new Date().toISOString();
        const currentLocalTimestampMinusTenSeconds = new Date(new Date().getTime() - 10000).toISOString();
        pointrel20141201Client.getServerStatus((error, serverResponse) => {
            if (error) {
                // TODO: translate
                const message = "Problem checking server status so application may not work correctly if server is unavailable: " + error;
                console.log("ERROR", error);
                console.log(message);
                alert(message);
                return;
            }
            console.log("Server response at: " + currentLocalTimestamp + " is: " + JSON.stringify(serverResponse), serverResponse);
            if (serverResponse.currentTimestamp < currentLocalTimestampMinusTenSeconds) {
                // TODO: Translate
                alert("The server unexpectedly responded with a time more than ten seconds earlier than this PC's time when the server's status was requested at " +
                    currentLocalTimestamp + ".\nPlease check your PC's clock for accuracy, or contact the server administrator if your PC's clock is accurate.\n" +
                    JSON.stringify(serverResponse));
            }
        });
    }
    */
}

export = Application;