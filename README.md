# VoiceOver.js

A CLI and TypeScript interface for VoiceOver screen reader  on macOS. 

Use it to launch VoiceOver and log output to the command line, or write your own scripts to drive the screen reader.

## Setup
1. Open VoiceOver Utility and check "Allow VoiceOver to be controller with AppleScript".
1. Enable Terminal app in System Preferences > Security & Privacy > Privacy > Accessibility.
1. Accept Terminal VoiceOver automation permissions when prompted. (You can manage these later in System Preferences > Security & Privacy > Privacy > Automation).

## Usage

### Launch VoiceOver with output logs

  $ npx voiceover

### Stop VoiceOver

- Press Control-C

### Troubleshooting

- If the program exits without quitting VoiceOver, press Command-F5 or close the VoiceOver caption panel using the X button.

## Example

### Launching a URL with VoiceOver running

  $ open https://www.example.com -a Safari && npx voiceover
  # => Welcome to macOS. VoiceOver is on.
  # => Example Domain - Google Chrome Page has 1 link 1 heading 8 articles

### Saving VoiceOver output to a text file

  $ open https://www.twitter.com -a Safari && npx voiceover | grep heading > headings.txt
