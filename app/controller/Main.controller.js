sap.ui.define([
    'jquery.sap.global',
    'sap/suite/ui/commons/library',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    'myapp/controller/Library'
],
        function (jQuery, SuiteLibrary, Controller, JSONModel, MessageToast, Library) {
            "use strict";

            var MainController = Controller.extend("myapp.controller.Main", {

                modelFlow: new JSONModel(),
                processFlow: null,

                onInit: function () {
                    var link = "model/ProcessFlowNodes_1.json";
                    Library.AjaxCallerData(link, this.SUCCESSFlowUpload.bind(this), this.FAILUREFlowUpload.bind(this));
                },

                SUCCESSFlowUpload: function (Jdata) {
                    this.modelFlow.setProperty("/flow", Jdata);
                    this.GetIDs();
                },
                FAILUREFlowUpload: function () {
                    MessageToast.show("Caricamento modello flusso fallito!", {duration: 3000});
                },
                GetIDs: function () {
                    var link = "/XMII/Illuminator?QueryTemplate=ACADPROD/Accademy/xacgetallsid&Content-Type=text/json";
                    Library.AjaxCallerData(link, this.SUCCESSGetIDs.bind(this), this.FAILUREGetIDs.bind(this));
                },
                SUCCESSGetIDs: function (Jdata) {
                    this.modelFlow.setProperty("/prova", Jdata.Rowsets.Rowset["0"].Row);
                    this.getView().setModel(this.modelFlow);
                },
                FAILUREGetIDs: function () {
                    MessageToast.show("Caricamento IDs fallito!", {duration: 3000});
                },


                onNodePress: function (event) {
                    MessageToast.show("Node " + event.getParameters().getNodeId() + " has been clicked.");
                },
                onPress: function (evt) {
                    var sId = evt.getSource().getSelectedKey();
                    var link = "/XMII/Runner?Transaction=ACADPROD/Accademy/getRoutings&Content-Type=text/xml&sid=" + sId + "&OutputParameter=JSON";
                    Library.AjaxCallerData(link, this.SUCCESSOnPress.bind(this), this.FAILUREOnPress.bind(this), "xml");
                },
                SUCCESSOnPress: function (Jdata) {
                    this.getView().getModel().setProperty("/flow", JSON.parse(jQuery(Jdata).find("Row").text()));
                    this.processFlow = this.getView().byId("processflow");
                    this.processFlow.updateModel();
                },
                FAILUREOnPress: function () {
                    MessageToast.show("Caricamento Routings fallito!", {duration: 3000});
                },
                onUpdateModel: function () {
                    var aNodes = this.processFlow.getNodes();
                    aNodes[0].setState(SuiteLibrary.ProcessFlowNodeState.Planned);
                    aNodes[1].setState(SuiteLibrary.ProcessFlowNodeState.Negative);
                    aNodes[1].setStateText("Negative");
                    aNodes[1].setTexts("Document State updated");
                    aNodes[2].setState(SuiteLibrary.ProcessFlowNodeState.Positive);
                    aNodes[2].setStateText("State Text changed");
                    aNodes[2].setTitle("Invoice OK");

                    this.processFlow.updateNodesOnly();
                    MessageToast.show("Model has been updated.");
                }
            });
            return MainController;
        });


 