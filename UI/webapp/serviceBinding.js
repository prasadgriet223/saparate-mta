function initModel() {
	var sUrl = "/apihub_sandbox/jam/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}