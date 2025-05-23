#![cfg_attr(not(feature = "std"), no_std)]

//! TokenChain Runtime: intègre la palette community-token dans une runtime Substrate minimaliste

use frame_support::construct_runtime;
use frame_system as system;

pub use pallet_community_token;
pub use pallet_governance;
pub use pallet_amm;
pub use pallet_kyc;

construct_runtime!(
    pub enum Runtime where
        Block = Block,
        NodeBlock = Block,
        UncheckedExtrinsic = UncheckedExtrinsic,
    {
        System: system::{Pallet, Call, Config, Storage, Event<T>},
        CommunityToken: pallet_community_token::{Pallet, Call, Storage, Event<T>},
        Governance: pallet_governance::{Pallet, Call, Storage, Event<T>},
        AMM: pallet_amm::{Pallet, Call, Storage, Event<T>},
        KYC: pallet_kyc::{Pallet, Call, Storage, Event<T>},
    }
);

// Types minimaux pour Block et Extrinsic (placeholders)
pub type Block = (); // À remplacer par la vraie définition Substrate
pub type UncheckedExtrinsic = (); // Idem
