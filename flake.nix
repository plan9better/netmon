{
  inputs = {
    naersk.url = "github:nix-community/naersk/master";
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    utils,
    naersk,
  }:
    utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};

        naersk-lib = pkgs.callPackage naersk {};
        daemon = naersk-lib.buildPackage ./daemon;
        daemonBuildInputs = with pkgs; [cargo rustc rustfmt pre-commit rustPackages.clippy];

        hub = pkgs.ocamlPackages.buildDunePackage {
          pname = "hub";
          version = "0.1.0";
          src = ./hub;
          duneVersion = "3";
          buildInputs = hubBuildInputs;
        };
        hubBuildInputs = with pkgs.ocamlPackages; [
          dune_3
          ocaml
          postgresql
        ];

        sightBuildInputs = with pkgs; [pnpm_10 nodejs_23];
      in {
        packages.daemon = daemon;
        packages.hub = hub;
        devShell = pkgs.mkShell {
          buildInputs = daemonBuildInputs ++ hubBuildInputs ++ sightBuildInputs;
          RUST_SRC_PATH = pkgs.rustPlatform.rustLibSrc;
        };
      }
    );
}
