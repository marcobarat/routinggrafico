sap.ui.define(['jquery.sap.global', 'sap/suite/ui/commons/library', 'sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/m/MessageToast'],
        function (jQuery, SuiteLibrary, Controller, JSONModel, MessageToast) {
            "use strict";
            var MainController = Controller.extend("myapp.controller.Main", {
                onInit: function () {

                    var sDataPath = jQuery.sap.getModulePath("myapp.model", "/ProcessFlowNodes.json");

                    var oModel = new JSONModel();
                    this.getView().setModel(oModel);



                    var that = this;

                    jQuery.ajax({
                        dataType: "json",
                        url: "model/ProcessFlowNodes.json",
                        async: false,
                        success: function (oData) {
                            that.getView().getModel().setProperty("/flow", oData);
                            //that.oProcessFlow = this.getView().byId("processflow");
                            //that.oProcessFlow.updateModel();
                        }
                    });
                    jQuery.ajax({
                        url: "/XMII/Illuminator?QueryTemplate=ACADPROD/Accademy/xacgetallsid&Content-Type=text/json",
                        method: "GET",
                        async: false,
                        success: function (oData) {
                            that.getView().getModel().setProperty("/prova", oData.Rowsets.Rowset["0"].Row);

                        },
                        error: function (oData) {
                            that.error(oData);
                        }
                    });

                    jQuery.ajax({
                        url: "/XMII/Illuminator?QueryTemplate=ACADPROD/Accademy/xacgetallsid&Content-Type=text/json",
                        method: "GET",
                        async: false,
                        success: function (oData) {
                            that.getView().getModel().setProperty("/prova", oData.Rowsets.Rowset["0"].Row);

                        },
                        error: function (oData) {
                            that.error(oData);
                        }
                    });



                },

                onOnError: function (event) {
                    MessageToast.show("Exception occurred: " + event.getParameters().text);
                },

                onNodePress: function (event) {
                    MessageToast.show("Node " + event.getParameters().getNodeId() + " has been clicked.");
                },

                onZoomIn: function () {
                    this.oProcessFlow.zoomIn();

                    MessageToast.show("Zoom level changed to: " + this.oProcessFlow.getZoomLevel());
                },

                onZoomOut: function () {
                    this.oProcessFlow.zoomOut();

                    MessageToast.show("Zoom level changed to: " + this.oProcessFlow.getZoomLevel());
                },
                onPress: function (evt) {
                    var sId = evt.getSource().getSelectedKey();
                    var that = this;
                    jQuery.ajax({
                        url: "/XMII/Runner?Transaction=ACADPROD/Accademy/getRoutings&Content-Type=text/xml&sid=" + sId + "&OutputParameter=JSON",
                        method: "GET",
                        dataType: "xml",
                        async: false,
                        success: function (oData) {
                            that.getView().getModel().setProperty("/flow", JSON.parse(jQuery(oData).find("Row").text()));
                            that.oProcessFlow = that.getView().byId("processflow");
                            that.oProcessFlow.updateModel();
                        },
                        error: function (oData) {
                            that.error(oData);
                        }
                    });
                },
                onUpdateModel: function () {
                    var aNodes = this.oProcessFlow.getNodes();
                    aNodes[0].setState(SuiteLibrary.ProcessFlowNodeState.Planned);
                    aNodes[1].setState(SuiteLibrary.ProcessFlowNodeState.Negative);
                    aNodes[1].setStateText("Negative");
                    aNodes[1].setTexts("Document State updated");
                    aNodes[2].setState(SuiteLibrary.ProcessFlowNodeState.Positive);
                    aNodes[2].setStateText("State Text changed");
                    aNodes[2].setTitle("Invoice OK");

                    this.oProcessFlow.updateNodesOnly();
                    MessageToast.show("Model has been updated.");
                }
            });
            return MainController;
        });


 