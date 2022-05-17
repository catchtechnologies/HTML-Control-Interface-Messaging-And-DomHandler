# HTML Control Interface Messaging And DomHandler

Connects HTML elements to a channel/value messaging system.

- [Overview](#overview)
- [Usage](#usage)
  - [Usage Example](#usage-example)
- [DomHandler](#domhandler)
  - [HTML Inputs & Input Events](#html-inputs--input-events)
  - [Update HTML Element Attributes](#update-html-element-attributes)
  - [Callbacks](#callbacks)
- [Messaging](#messaging)
  - [Keep Alive Heartbeat](#keep-alive-heartbeat)
  - [Action Messages](#action-messages)
- [Go Deeper... Integrating With Automation & Control Systems](#integrating-with-automation--control-systems)

## Overview

A group of `Messaging` functions in `messaging.js` creates a websocket connection with the server to send and receive messages.

The `DomHandler` class in `domhandler.js` detects and parses DOM events and sends the resulting messages to the server via `Messaging`. It also receives messages from `Messaging` to update DOM elements.

## Usage

- Add the following files to your html project. In the example, the files are placed in `./js/controller-integration/`
  - `control-element-types.js`
  - `domhandler.css`
  - `domhandler.js`
  - `messaging.js`
- Add the following references inside the HTML body tag:  
  `<script src="js/controller-integration/domhandler.js" type="module"></script>`  
  `<link type="text/css" rel="stylesheet" href="/js/controller-integration/domhandler.css" />`
  `<script src="js/controller-integration/messaging.js" type="module"></script>`
- Add the desired `data-` tags to your HTML elements.

### Usage Example

```Javascript
import DomHandler from "./js/controller-integration/domhandler.js";
const debug = true;
const domHandler = new DomHandler(debug, null, null);

domHandler.handleUpdate("matrix.input.active", "2");
domHandler.handleUpdate("matrix.input.2.disabled", "disable");
domHandler.handleUpdate("matrix.input.2.info", "Not Connected");
```

```HTML
<button
  data-button-channel="matrix.input"
  data-pointerdown-value="2"
  data-active-channel="matrix.input.active"
  data-active-value="2"
  data-disabled-channel="matrix.input.2.disabled"
  data-disabled-value="disable"
>
  <div>
    <p>Input 2</p>
    <p data-inner-html-channel="matrix.input.2.info"></p>
  </div>
</button>
```

# DomHandler

## HTML Inputs & Input Events

HTML inputs can be used to send a channel/value message to the webserver over the websocket created in `messaging.js`.

The `data-INPUT_TYPE-channel` tag dictates the input type and the channel to publish the message on. Either a `data-EVENT-value` tag or the `value` tag indicates the value to send for a particular input event. Supported input types are:

- [button](#button-input)
- [checkbox](#checkbox-input)
- [mcsa](#mcsa-input)
- [number](#number-input)
- [range](#range-input)
- [select](#select-input)

### Button Input

A button.

#### Channel Tag

`data-button-channel`

#### Value Tags

- `data-click-value`
  ```HTML
  <button data-button-channel="my.button.channel" data-click-value="clicked">Send Click Event</button>
  ```
- `data-pointerdown-value`
  ```HTML
  <button data-button-channel="my.button.channel" data-pointerdown-value="pointerdown">Send Pointer Down Event</button>
  ```
- `data-pointerup-value`

  ```HTML
  <button data-button-channel="my.button.channel" data-pointerup-value="pointerup">Send Pointer Up Event</button>
  ```

### Checkbox Input

A checkbox or radio button.

#### Channel Tag

`data-checkbox-channel`

#### Value Tags

An extra `data-EVENT-value` tag is not required. The value of the input's `value` tag is used for messaging.

```HTML
<input data-checkbox-channel="my.checkbox" class="form-check-input" type="checkbox" value="myCheckboxValue" />
<label class="form-check-label">
  Option 1
</label>
```

### MCSA Input

Mulitple choice, single answer. A checkbox or radio button that shares the same channel with other elements. Only one can be true.

#### Channel Tag

`data-mcsa-channel`

#### Value Tags

An extra `data-EVENT-value` tag is not required. The value of the input's `value` tag is used for messaging.

```HTML
<div class="form-check">
  <input
    class="form-check-input"
    data-mcsa-channel="my.mcsa.channel"
    type="radio"
    name="exampleRadios"
    id="exampleRadios1"
    value="myMcsaValue1"/>
  <label class="form-check-label" for="exampleRadios1">
    Option 1
  </label>
</div>
<div class="form-check">
  <input
    class="form-check-input"
    data-mcsa-channel="my.mcsa.channel"
    type="radio"
    name="exampleRadios"
    id="exampleRadios2"
    value="myMcsaValue2"/>
  <label class="form-check-label" for="exampleRadios2">
    Option 2
  </label>
</div>
```

### Number Input

A number field.

#### Channel Tag

`data-number-channel`

#### Value Tags

An extra `data-EVENT-value` tag is not required. The value of the input's `value` tag is used for messaging.

```HTML
<input data-number-channel="my.number.channel" type="number" placeholder="Enter A Number" aria-label="Number Input"/>
```

### Range Input

A range slider.

#### Channel Tag

`data-range-channel`

#### Value Tags

An extra `data-EVENT-value` tag is not required. The value of the input's `value` tag is used for messaging.

```HTML
 <input data-range-channel="my.range.channel" type="range" placeholder="Select A Value" aria-label="Range Input " />
```

### Select Input

Dropdown select.

#### Channel Tag

`data-select-channel`

#### Value Tags

An extra `data-EVENT-value` tag is not required. The value of the input's `value` tag is used for messaging.

```HTML
<div class="form-group">
  <label for="exampleFormControlSelect1"> select</label>
  <select
    class="form-control"
    id="exampleFormControlSelect1"
    data-select-channel="my.select.channel"
  >
    <option value="my.select.value.1">Option 1</option>
    <option value="my.select.value.2">Option 2</option>
    <option value="my.select.value.3">Option 3</option>
  </select>
</div>
```

### Text Input

A text field.

#### Channel Tag

`data-text-channel`

#### Value Tags

An extra `data-EVENT-value` tag is not required. The value of the input's `value` tag is used for messaging.

```HTML
<input
  id="test"
  data-text-channel="my.text.channel"
  type="text"
  aria-label="Text Input"
  placeholder="Enter Text & Press Enter"
  value="Intial text"
/>
```

## Update HTML Element Attributes

Messages received from the webserver over the websocket created in `Messaging` are used to update the attributes of HTML elements via the DOM.

Recieving messages can be simulated in Javascript by sending a channel and value to the `handleUpdate(channel, value)` function as in the following example.

```Javascript
import DomHandler from "./controller-integration/domhandler.js";
domHandler = new DomHandler(true, null, null);
domHandler.handleUpdate("my.active.channel", "2");
```

The `data-ATTRIBUTE-channel` tag dictates the attribute to update. The `data-ATTRIBUTE-value` tag indicates the value to either:

- send to the HTML element
- or compare to for true/false attributes.

Supported updates are:

- [active](#active-update)
- [disabled](#disabled-update)
- [hidden](#hidden-update)
- [invisible](#invisible-update)
- [inner-html](#inner-html-update)
- [style](#style-attribute-update)

### Active Update

Adds the `active` class to the element if the values match and removes the `active` class to the element if the values do not match.

#### Channel Tag

`data-active-channel`

#### Value Tag

`data-active-value`

#### Example

In this example, a message with channel `my.active.channel` and a value of `1` adds the `active` class to this button. Any other value removes the `active` class.

```HTML
<button data-active-channel="my.active.channel" data-active-value="1">Active Button</button>
```

### Disabled Update

Adds the `disabled` attribute if the values match and removes the `disabled` attribute of the element if the values do not match.

#### Channel Tag

`data-disabled-channel`

#### Value Tag

`data-disabled-value`

#### Example

In this example, a message with channel `my.disabled.channel` and a value of `1` adds the `disabled` attribute to this button. Any other value removes the `disabled` attribute.

```HTML
<button data-disabled-channel="my.disabled.channel" data-disabled-value="1">Disabled Button</button>
```

### Hidden Update

Adds the `hidden="true"` attribute if the values match and removes the `hidden="true"` attribute of the element if the values do not match.

The `hidden="true"` attribute hides the HTML element from view while retaining its height and width in the layout.

#### Channel Tag

`data-hidden-channel`

#### Value Tag

`data-hidden-value`

#### Example

In this example, a message with channel `my.hidden.channel` and a value of `1` adds the `hidden="true"` attribute to this button. Any other value removes the `hidden="true"` attribute.

```HTML
<button data-hidden-channel="my.hidden.channel" data-hidden-value="1">Hidden Button</button>
```

### Invisible Update

Adds the `display:none` css style if the values match and removes the `display:none` css style from the element if the values do not match.

The `display:none` css style removes the HTML element completely and does not retain the element's height and width in the layout.

#### Channel Tag

`data-invisible-channel`

#### Value Tag

`data-invisible-value`

#### Usage

Add the following css to your project to add and remove an element's visbility. Or import the included `domhandler.css` file into your project.

```css
.invisible {
  display: none;
}
```

#### Example

In this example, a message with channel `my.invisible.channel` and a value of `1` adds the `display:none` css style to this button. Any other value removes the `display:none` css style.

```HTML
<button data-invisible-channel="my.invisible.channel" data-invisible-value="1">Invisible Button</button>
```

### Inner HTML Update

Sets the element's `innerHTML` to the message's value.

#### Channel Tag

`data-inner-html-channel`

#### Value Tag

A value tag is not required.

#### Example

In this example, the text `Inner HTML Button` is replaced with the value of any message received with channel `my.inner-html.channel`.

```HTML
<button data-inner-html-channel="my.inner-html.channel">Inner HTML Button</button>
```

### Style Attribute Update

Adds one or more CSS properties to the element's `style` attribute.

The message's `value` must be a JSON formatted string containing the CSS properties such as: `'{ "color": "red", "font-weight": "bold" }'`.

#### Channel Tag

`data-style-channel`

#### Value Tag

A value tag is not required.

#### Example

In this example, the CSS color and font-weight properties are set when the value `'{ "color": "red", "font-weight": "bold" }'` is received with channel `my.style.channel`.

```HTML
<button data-style-channel="my.style.channel">Style Button</button>
```

## Callbacks

The `DomHandler` class provides two callbacks that inform you of messages sent and received.

```Javascript
import DomHandler from "./js/controller-integration/domhandler.js";

domHandler = new DomHandler(
  // Prints debug messages to console when true.
  true,
  // Message received callback.
  (channel, value) => {
    console.log("Received message with channel: " + channel + " and value: " + value);
  },
  // Sending message callback.
  (channel, value) => {
    console.log("Sending message with channel: " + channel + " and value: " + value);
  }
);
```

# Messaging

`Messaging` is started automatically from `DomHandler` and connects to a websocket server located at the browser window's URL plus the endpoint `/updates`.

All messages excluding the `keep alive heartbeat` are a JSON formatted string with an `action` and `options` key.

## Keep Alive Heartbeat

`Messaging` sends the string `pong` whenever the string `ping` is received.

## Action Messages

### Subscribe Action

After successfully connecting the websocket, a subscribe message is sent with an array of channels that the HTML project contains. The server can use this message to send back an update with the current value of each channel and updates whenever the value for a channel changes.

#### Example Subscribe Action

Sent to the server.

```JSON
{
  action: "subscribe",
  options: ["matrix.input", "matrix.input.active", "matrix.input.2.disabled"]
}
```

### Registration Action

The server can assign an unique identifier to the websocket connection with the `Registration Action`. The id will then be sent with every `Publish Action`.

#### Example Registration Action

Sent from the server.

```JSON
{
  action: "registration",
  options: {
    id: "A_UUID"
  }
}
```

### Update Action

`Update Action`s are received over the websocket and passed to the `DomHandler` to update HTML elements.

#### Example Update Action

Sent from the server. Can be a single message or an array.

```JSON
{
  action: "update",
  options: {
    channel: "THE_CHANNEL",
    value: "THE_VALUE"
  }
}
```

```JSON
{
  action: "update",
  options: [{
    channel: "THE_CHANNEL",
    value: "THE_VALUE"
  },{
    channel: "ANOTHER_CHANNEL",
    value: "ANOTHER_VALUE"
  }]
}
```

### Publish Action

After `DomHandler` detects and parses an HTML DOM event, the resulting message is sent to the server over the websocket.

#### Example Publish Action

```JSON
{
  action: "publish",
  options: {
    channel: "THE_CHANNEL",
    value: "THE_VALUE"
    originId: "THE_ID_FROM_THE_REGISTRATION_ACTION",
  },
};
```

## Integrating With Automation & Control Systems

Here is a blog post covering how this project can be integrated as part of a larger automation & control system.
https://www.learnavprogramming.com/html5-part-i/
