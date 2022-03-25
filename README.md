# VoiceOver.js

A CLI and TypeScript interface for VoiceOver screen reader  on macOS. 

Use it to launch VoiceOver and log output to the command line, or write your own scripts to drive the screen reader.

## Setup
1. Open VoiceOver Utility and check "Allow VoiceOver to be controller with AppleScript".
1. Enable Terminal app in System Preferences > Security & Privacy > Privacy > Accessibility.
1. Accept Terminal VoiceOver automation permissions when prompted. (You can manage these later in System Preferences > Security & Privacy > Privacy > Automation).

## Usage

### CLI

    $ npx voiceover

- Press Control-C to stop.

### NodeJS

```javascript
import { VoiceOver } from 'voiceover';

const voiceOver = new VoiceOver();
await voiceOver.launch(); // start VoiceOver screen reader
voiceOver.tail(); // print last phrase on navigation
// perform actions using seek, rotor, and execute
await voiceOver.quit(); // stop VoiceOver
```

#### Examples

##### Advance cursor to text

You can navigate to a specific phrase:

```javascript
await voiceOver.seek({ text: 'Example' }); // move cursor right to the next occurance of this phrase
```

##### Rotor Navigation

In a realistic user scenario, someone could navigate the page by headings:

```javascript
await voiceOver.rotor({ menu: 'Headings', find: 'my heading' }); // navigate directly to a heading using the web rotor
```

or by landmark:

```javascript
await voiceOver.rotor({ menu: 'Landmarks', find: 'search' }); // navigate directly to a heading using the web rotor
```

### Troubleshooting

- If the program exits without quitting VoiceOver, press Command-F5 or close the VoiceOver caption panel using the X button.

## Examples

### Launching a URL with VoiceOver running

    $ open https://www.example.com -a Safari && npx voiceover
    #=> Welcome to macOS. VoiceOver is on.
    #=> Example Domain - Google Chrome Page has 1 link 1 heading 8 articles

### Saving VoiceOver output to a text file

    $ open https://www.twitter.com -a Safari && npx voiceover | grep heading > headings.txt
