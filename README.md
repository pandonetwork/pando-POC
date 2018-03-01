<h1 align="center">
  <br>
  <a href="http://wespr.co">
    <img src="https://raw.githubusercontent.com/wespr/wespr-core/master/branding/logo.png" alt="wespr" width="200"></a>
  <br>
  Pando
  <br>
</h1>

A PoC versioning system based on [IPFS](https://ipfs.io) and [AragonOS](https://github.com/aragon/aragonOS).

## Notes

This software is in a **very** alpha stage and is not meant to be used in production. It is just a PoC showing what can be done using AragonOS and IPFS.

## Why Pando ?

[Pando](https://en.wikipedia.org/wiki/Pando_(tree)) (Latin for "spread out"), also known as the Trembling Giant is a clonal colony of a single male quaking aspen (Populus tremuloides) determined to be a single living organism by identical genetic markers and assumed to have one massive underground root system. The plant occupies 43 hectares (106 acres) and is estimated to weigh collectively 6,000,000 kilograms (6,600 short tons), making it the heaviest known organism. The root system of Pando, at an estimated 80,000 years old, is among the oldest known living organisms.

## Installation

```
npm install -g @wespr/pando
```

## Usage
```
pando --help

  Usage: pando [options] [command]


  Options:

    -h, --help  output usage information


  Commands:

    init              create an empty pando repository
    commit <message>  commit changes
    push              push changes to remote repository
    log               show pasts commits
    revert <cid>      revert to a previous commit
    clone <address>   clone a remote repository
    grant <address>   grant PUSH rights to address
    fetch             fetch sources from remote repository
```