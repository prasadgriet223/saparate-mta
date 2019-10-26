sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox"
], function (Controller, Fragment, MessageBox) {
	"use strict";

	return Controller.extend("scp.com.saparate.controller.NewPipeLine", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf scp.com.saparate.view.NewPipeLine
		 */
		onInit: function () {
			this._wizard = this.byId("CreatePipeLine");
			this._oNavContainer = this.byId("idNewPipeLineNavContainer");
			this._oWizardContentPage = this.byId("idNewPipeline");
			this._oRouter = this.getOwnerComponent().getRouter();
			this._oRouter.getRoute("NewPipeLine").attachPatternMatched(this._onObjectMatched, this);
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf scp.com.saparate.view.NewPipeLine
		 */
		onBeforeRendering: function () {

		},
		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf scp.com.saparate.view.NewPipeLine
		 */
		// onAfterRendering: function() {

		// },
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf scp.com.saparate.view.NewPipeLine
		 */
		onExit: function () {

		},
		navigatetoProjectPipeline: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Projects");
		},
		selectRepoType: function (oEvent) {
			this._wizard.validateStep(this.byId("Authstep"));
		},
		_onObjectMatched: function (oEvent) {
			this.getView().setModel(this.getOwnerComponent().getModel("repoType"), "RepoType");
			var oModel_auth = new sap.ui.model.json.JSONModel();
			//		this._oNavContainer = this.byId("idNewPipeLineNavContainer");
			this._oNavContainer.to(this._oWizardContentPage);
			oModel_auth.loadData(this.getOwnerComponent().getModel("servers").getProperty("credentials"));
			this.getView().setModel(oModel_auth, "credentials");
			this._wizard.discardProgress(this.byId("Authstep"));
			this._wizard.discardProgress(this.byId("idReposStep"));
			this._wizard.discardProgress(this.byId("branchesStep"));
		},
		selectRepo: function (oEvent) {
			if (this.byId("idReposStep").getValidated())
				this._wizard.discardProgress(this.byId("idReposStep"));
			else
				this._wizard.validateStep(this.byId("idReposStep"));
		},
		loadRepos: function (oEvent) {
			if (this.byId("RepoTypeStep").getValidated())
				this._wizard.discardProgress(this.byId("RepoTypeStep"));
			else
				this._wizard.validateStep(this.byId("RepoTypeStep"));
		},
		selectBranch: function (oEvent) {
			if (this.byId("idbranchesStep").getValidated())
				this._wizard.discardProgress(this.byId("idbranchesStep"));
			else
				this._wizard.validateStep(this.byId("idbranchesStep"));
		},
		afterloadRepoType: function (oEvent) {
			this.getView().byId("idRepoTypeList").removeSelections(true);
		},
		afterloadReposStep: function (oEvent) {
			var oModel_repos = new sap.ui.model.json.JSONModel();
			var credentials = {
				"credentialId": this.getView().byId("idCredSelect").getSelectedKey(),
				"repoType": this.getView().byId("idRepoTypeList").getSelectedItem().data("repokey")
			};
			oModel_repos.loadData(this.getOwnerComponent().getModel("servers").getProperty("repos"), JSON.stringify(credentials), true,
				"POST", false, false, {
					"Content-Type": "application/json"
				});
			oModel_repos.attachRequestCompleted(function () {

			});
			this.getView().setModel(oModel_repos, "Repos");
		},
		NewPipeLineReviewHandler: function (oEvent) {
			if (!this.oNewPipeLinereviewPageFragment) {
				this.oNewPipeLinereviewPageFragment = sap.ui.xmlfragment(this.getView().getId(),
					"scp.com.saparate.view.fragments.NewPipeLineReviewPage", this);
				this.getView().addDependent(this.oNewPipeLinereviewPageFragment);
				this._oNavContainer.addPage(this.oNewPipeLinereviewPageFragment);
				this._oNavContainer.to(this.oNewPipeLinereviewPageFragment);
			}

			//this.getView().byId("idCredSelect").getSelectedItem().getText()
			this.getView().byId("idNewPipeLineCredentials").setText(this.getView().byId("idCredSelect").getSelectedItem().getText());
			this.getView().byId("idNewPipeLineRepoType").setText(this.getView().byId("idRepoTypeList").getSelectedItem().data("repokey"));
			this.getView().byId("idNewPipeLineRepository").setText(this.getView().byId("idReposList").getSelectedItem().data("repohttps"));
			this.getView().byId("idNewPipeLineBranch").setText(this.getView().byId("idBranchList").getSelectedItem().data("branchkey"));
			this.getView().byId("idNewPipeLineBuildType").setText(this.getView().byId("idBuildSelect").getSelectedItem().getText());
		},
		afterLoadBranchesStep: function (oEvent) {
			var oModel_branches = new sap.ui.model.json.JSONModel();
			var oinput = {
				"credentialId": this.getView().byId("idCredSelect").getSelectedKey(),
				"url": this.getView().byId("idReposList").getSelectedItem().data("repohttps")
			};
			oModel_branches.loadData(this.getOwnerComponent().getModel("servers").getProperty("branches"), JSON.stringify(oinput), true,
				"POST", false, false, {
					"Content-Type": "application/json"
				});
			this.getView().setModel(oModel_branches, "branch");
		},
		handleCreateNewPipeLineSubmit: function (oEvent) {
			this._handleMessageBoxOpen("Are you sure you want to create a NewPipe Line?", "confirm");
		},
		handleCreateNewPipeLineCancel: function () {
			this._handleMessageBoxOpenforcancel("Are you sure you want to cancel your New PipeLineCreation?", "warning");
		},

		additionalInfoValidation: function () {
			var jobName = this.byId("ip_JobName").getValue();
			if (jobName.length > 5)
				this._wizard.validateStep(this.byId("Authstep"));

			else
				this._wizard.invalidateStep(this.byId("Authstep"));

		},
		_handleMessageBoxOpenforcancel: function (sMessage, sMessageBoxType) {
			var that = this;
			MessageBox[sMessageBoxType](sMessage, {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						that._oRouter.navTo("jobs", {
							from: "tonewpipeline"
						});
					}
				}
			});
		},
		_handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
			MessageBox[sMessageBoxType](sMessage, {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						var oNewPipeLineInput = {
							"jobName": this.byId("ip_JobName").getValue(),
							"piperPipeline": {
								"stages": [{
									"name": "prepare",
									"statementList": [{
										"type": "scm",
										"branchName": "*/" + this.getView().byId("idBranchList").getSelectedItem().data("branchkey"),
										"credsID": this.getView().byId("idCredSelect").getSelectedItem().data("credkey"),
										"scmURL": this.getView().byId("idReposList").getSelectedItem().data("repohttps")
									}]
								}, {
									"name": "prepareConfigYaml",
									"statementList": [{
										"type": "gst",
										"statment": "writeFile file:\".pipeline/config.yaml\", text: \"${params.configyaml}\""
									}]
								}, {
									"name": "prepareBuild",
									"statementList": [{
										"type": "gst",
										"statment": "setupCommonPipelineEnvironment script:this"
									}]
								}, {
									"name": "Build",
									"statementList": [{
										"type": "gst",
										"statment": "mtaBuild script: this"
									}]
								}
								
								]
							},
							"clodfoundryId": "1"
						};
						var oModel_CreatePipeLine = new sap.ui.model.json.JSONModel();
						oModel_CreatePipeLine.loadData(this.getOwnerComponent().getModel("servers").getProperty("addjob"), JSON.stringify(
								oNewPipeLineInput), true,
							"POST", false, false, {
								"Content-Type": "application/json"
							});
						oModel_CreatePipeLine.attachRequestCompleted(function () {
							MessageBox.show((oModel_CreatePipeLine.getData().response), {
								title: "Result",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function (oActions) {
									if (oActions === "OK") {
										var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
										oRouter.navTo("jobs", {
											from: "tonewpipeline"
										});
									}
								}.bind(this)
							});
						}.bind(this));
					}
				}.bind(this)
			});
		}
	});

});

// {
// 	"jobName": "Pipeline mock demo",
// 	"piperPipeline": {
// 		"stages": [{
// 			"name": "prepare",
// 			"statementList": [{
// 				"type": "scm",
// 				"branchName": " */master",
// 				"credsID": "21419d94-4438-4d6d-ade3-40de3c3fffa1",
// 				"scmURL": "https://gitlab.com/ravikishore1979/tutorial2"
// 			}]
// 		}, {
// 			"name": "prepareConfigYaml",
// 			"statementList": [{
// 				"type": "gst",
// 				"statment": "writeFile file:\".pipeline/config.yaml\", text: \"${params.configyaml}\""
// 			}]
// 		}, {
// 			"name": "prepareBuild",
// 			"statementList": [{
// 				"type": "gst",
// 				"statment": "setupCommonPipelineEnvironment script:this"
// 			}]
// 		}, {
// 			"name": "Build",
// 			"statementList": [{
// 				"type": "gst",
// 				"statment": "mtaBuild script: this"
// 			}]
// 		}, {
// 			"name": "Deploy",
// 			"statementList": [{
// 				"type": "gst",
// 				"statment": "cloudFoundryDeploy script: this"
// 			}]
// 		}]
// 	},
// 	"clodfoundryId": "16"
// }

// oModel_auth.setData([{
// 	"id": 1,
// 	"scope": "GLOBAL",
// 	"userName": "lokeshg1729@gmail.com",
// 	"password": "Password1!",
// 	"credentialKey": "e7d04428-45e4-4a4d-99e9-63c99df0218c"
// }]);

// oModel_repos.setData([{
// 	"name": "saparate server",
// 	"httpsUrl": "https://lokeshinno@bitbucket.org/saparatedeveloper/saparate-server.git",
// 	"sshUrl": "git@bitbucket.org:saparatedeveloper/saparate-server.git"
// }, {
// 	"name": "saparate",
// 	"httpsUrl": "https://lokeshinno@bitbucket.org/saparatedeveloper/saparate.git",
// 	"sshUrl": "git@bitbucket.org:saparatedeveloper/saparate.git"
// }, {
// 	"name": "MyJenkinsTest",
// 	"httpsUrl": "https://lokeshinno@bitbucket.org/lokeshinno/myjenkinstest.git",
// 	"sshUrl": "git@bitbucket.org:lokeshinno/myjenkinstest.git"
// }, {
// 	"name": "spring-boot-demo",
// 	"httpsUrl": "https://lokeshinno@bitbucket.org/lokeshinno/spring-boot-demo.git",
// 	"sshUrl": "git@bitbucket.org:lokeshinno/spring-boot-demo.git"
// }, {
// 	"name": "demo",
// 	"httpsUrl": "https://lokeshinno@bitbucket.org/lokeshinno/demo.git",
// 	"sshUrl": "git@bitbucket.org:lokeshinno/demo.git"
// }]);
// oModel_branches.setData([{
// 	"branch": "master"
// }, {
// 	"branch": "saparate"
// }]);
// ResourceBundle.create({
// url: "i18n/Servers.properties",
// async: true
// }).then(function (oBundle) {
// console.log(oBundle);
// });
// $.ajax({
// 	url: this.getOwnerComponent().getModel("servers").getProperty("jobsURL"),
// 	type: "GET",
// 	async: false,
// 	success: function (data, textStatus, XMLHttpRequest) {
// 	console.log(data);
// 	}
// });

// oModel_branches.attachRequestCompleted(function () {
// 	console.log(oModel_branches.getData()["response"]);
// });
//	this._wizard.destroyStep(this.byId("RepoTypeStep"));
// this._wizard.invalidateStep(this.byId("RepoTypeStep"));
// this._wizard.invalidateStep(this.byId("RepoStep"));
// this._wizard.invalidateStep(this.byId("branchesStep"));
// this.byId("RepoTypeStep").setValidated(false);
// this.byId("RepoStep").setValidated(false);
//	this.byId("branchesStep").setValidated(false);
// this.byId("RepoStep").invalidate();
// this.byId("branchesStep").invalidate();
// ,{
// 	"path": "/destinations/saparate",
// 	"target": {
//  "type": "destination",
// 	"name": "saparate"
// 	},
// 	"description": "saparateRESTService"
// 	}
//  "dataSources": {
// 	"Backend": {
// 	"uri": "/destinations/saparate",
// 	"type": "JSON"
// 	}
//  }
//  ,
// 	"jenkins": {
// 	"settings": {},
// 	"dataSource": "Backend",
// 	"preload": false
// 	}

// this.getView().setModel(this.getOwnerComponent().getModel("Repos"), "Repos");
// this.getView().setModel(this.getOwnerComponent().getModel("branch"), "branch");
// new sap.ui.model.json.JSONModel();
// this.getOwnerComponent().getModel("jenkins").loadData("jenkins/getAllJobs", true, "GET").then(function (response) {
// console.log(response);
// });

// oModel.setData([{
// 	"id": 1,
// 	"scope": "GLOBAL",
// 	"userName": "lokeshg1729@gmail.com",
// 	"password": "Password1!",
// 	"credentialKey": "e7d04428-45e4-4a4d-99e9-63c99df0218c"
// }]);

// 	this.byId("RepoTypeStep").setValidated(false);
// else
// //			this._wizard.discardProgress(this.byId("idReposStep"));
// var oModel_Repos = new sap.ui.model.json.JSONModel();
//oModel_Repos.loadData(this.getOwnerComponent().getModel("servers").getProperty("Repos"));
// oModel.loadData(this.getUrlPath("alljobs"), "", true, "GET", false, true, {
// 	"Authorization": "123"
// });
// oModel.attachRequestCompleted(function () {
// 	console.log(oModel.getData());
// 	that.getView().setBusy(false);
// 	that.getView().setModel(oModel, "jobs");
// });
// this._wizard.validateStep(this.byId("RepoTypeStep"));
// if (this.byId("RepoTypeStep").getValidated)
// 	this._wizard.invalidateStep(this.byId("RepoTypeStep"));

// Fragment.load({
// 	name: "scp.com.saparate.view.fragments.NewPipeLineReviewPage",
// 	controller: this
// }).then(function (oWizardReviewPage) {
// 	this._oWizardReviewPage = oWizardReviewPage;
// 	this._oNavContainer.addPage(this._oWizardReviewPage);
// }.bind(this));

// var oFragment = sap.ui.xmlfragment("testistest", "com.natuvion.ddi.fragments.select.address");
//   var oLayout = this.getView().byId("AddressIDandSoOn");

//   oLayout.insertContent(oFragment, -1)
// Fragment.load({
// 	name: "sap.m.sample.Wizard.view.ReviewPage",
// 	controller: this
// }).then(function (oWizardReviewPage) {
// 	this._oWizardReviewPage = oWizardReviewPage;
// 	this._oNavContainer.addPage(this._oWizardReviewPage);
// }.bind(this));

// var oView = this.getView();
// Fragment.load({
// 	name: "scp.com.saparate.view.fragments.NewPipeLineReviewPage",
// 	controller: this
// }).then(function (oWizardReviewPage) {
// 	this._oWizardReviewPage = oWizardReviewPage;
// 	oView.addDependent(oWizardReviewPage);
// 	this._oNavContainer.addPage(this._oWizardReviewPage);
// }.bind(this)).then(function () {
// 	this._oNavContainer.to(this._oWizardReviewPage);
// }.bind(this));

// if (!this.oNewPipeLinereviewPageFragment) {
// 	this.oNewPipeLinereviewPageFragment = sap.ui.xmlfragment("NewPipeLinereviewPageFragment",
// 		"scp.com.saparate.view.fragments.NewPipeLineReviewPage", this);
// 	this.getView().addDependent(this.oNewPipeLinereviewPageFragment);
// }
// , 
								
// 								{
// 									"name": "Deploy",
// 									"statementList": [{
// 										"type": "gst",
// 										"statment": "cloudFoundryDeploy script: this"
// 									}]
// 								}


// alljobs=https://na1.saparate.com/saparate/jenkins/getAllJobs
// log=https://na1.saparate.com/saparate/jenkins/getLog
// abortjob=https://na1.saparate.com/saparate/jenkins/abortJob
// stagelog=https://na1.saparate.com/saparate/jenkins/getStageLog
// deletejob=https://na1.saparate.com/saparate/jenkins/deleteJob
// getallcredentials=https://na1.saparate.com/saparate/credential/getAll
// getcfc=https://na1.saparate.com/saparate/cloudfoundary/getAll
// addcfc=https://na1.saparate.com/saparate/cloudfoundary/addOrUpdate
// addorupdate=https://na1.saparate.com/saparate/credential/addOrUpdate