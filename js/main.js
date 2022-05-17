import DomHandler from "./controller-integration/domhandler.js";

const debug = true;
var domHandler;

start();

function start() {
  try {
    // Get elements to display messages for testing.
    var domhandlerTxCh = document.getElementById("domhandler-tx-ch");
    var domhandlerTxValue = document.getElementById("domhandler-tx-value");
    var domhandlerRxCh = document.getElementById("domhandler-rx-ch");
    var domhandlerRxValue = document.getElementById("domhandler-rx-value");

    /***  DOM Handler ***/

    domHandler = new DomHandler(
      debug,
      (channel, value) => {
        domhandlerTxCh.innerHTML = channel;
        domhandlerTxValue.innerHTML = value;
      },
      (channel, value) => {
        domhandlerRxCh.innerHTML = channel;
        domhandlerRxValue.innerHTML = value;
      }
    );

    // Simulate Messaging messages from button presses in index.html
    var activeTest = document.getElementById("activeTest");
    activeTest.onpointerdown = () => {
      domHandler.handleUpdate("laptop.active", "1");
    };
    var inactiveTest = document.getElementById("inactiveTest");
    inactiveTest.onpointerdown = () => {
      domHandler.handleUpdate("laptop.active", "0");
    };

    var disableTest = document.getElementById("disableTest");
    disableTest.onpointerdown = () => {
      domHandler.handleUpdate("hdmi.disable", "1");
    };

    var enableTest = document.getElementById("enableTest");
    enableTest.onpointerdown = () => {
      domHandler.handleUpdate("hdmi.disable", "0");
    };

    var hideTest = document.getElementById("hideTest");
    hideTest.onpointerdown = () => {
      domHandler.handleUpdate("computer.hidden", "1");
    };

    var unhideTest = document.getElementById("unhideTest");
    unhideTest.onpointerdown = () => {
      domHandler.handleUpdate("computer.hidden", "0");
    };

    var invisibleTest = document.getElementById("invisibleTest");
    invisibleTest.onpointerdown = () => {
      domHandler.handleUpdate("conference.invisible", "1");
    };

    var visibleTest = document.getElementById("visibleTest");
    visibleTest.onpointerdown = () => {
      domHandler.handleUpdate("conference.invisible", "0");
    };

    var innerHtmlTest1 = document.getElementById("innerHtmlTest1");
    innerHtmlTest1.onpointerdown = () => {
      domHandler.handleUpdate("lights.info", "50%");
    };

    var innerHtmlTest2 = document.getElementById("innerHtmlTest2");
    innerHtmlTest2.onpointerdown = () => {
      domHandler.handleUpdate("lights.info", "100%");
    };

    var styleTest1 = document.getElementById("styleTest1");
    styleTest1.onpointerdown = () => {
      domHandler.handleUpdate(
        "lights.off.style",
        '{ "color": "red", "font-weight": "bold" }'
      );
    };

    var styleTest2 = document.getElementById("styleTest2");
    styleTest2.onpointerdown = () => {
      domHandler.handleUpdate(
        "lights.off.style",
        '{ "color": "white", "font-weight": "normal" }'
      );
    };
  } catch (e) {
    console.log(e);
  }
}
