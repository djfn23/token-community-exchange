#![cfg_attr(not(feature = "std"), no_std)]

//! Pallet Governance: gestion simple de propositions et votes pour TokenChain
use frame_support::{dispatch::DispatchResult, pallet_prelude::*};
use frame_system::pallet_prelude::*;

#[frame_support::pallet]
pub mod pallet {
    use super::*;

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;
    }

    #[pallet::storage]
    #[pallet::getter(fn proposals)]
    pub type Proposals<T: Config> = StorageMap<_, Blake2_128Concat, u32, Vec<u8>, OptionQuery>;
    #[pallet::storage]
    #[pallet::getter(fn votes)]
    pub type Votes<T: Config> = StorageDoubleMap<_, Blake2_128Concat, u32, Blake2_128Concat, T::AccountId, bool, OptionQuery>;
    #[pallet::storage]
    #[pallet::getter(fn proposal_count)]
    pub type ProposalCount<T: Config> = StorageValue<_, u32, ValueQuery>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        ProposalCreated(u32, Vec<u8>),
        Voted(u32, T::AccountId, bool),
    }

    #[pallet::error]
    pub enum Error<T> {
        ProposalNotFound,
        AlreadyVoted,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::weight(10_000)]
        pub fn propose(origin: OriginFor<T>, description: Vec<u8>) -> DispatchResult {
            let who = ensure_signed(origin)?;
            let id = ProposalCount::<T>::get();
            Proposals::<T>::insert(id, &description);
            ProposalCount::<T>::put(id + 1);
            Self::deposit_event(Event::ProposalCreated(id, description));
            Ok(())
        }
        #[pallet::weight(10_000)]
        pub fn vote(origin: OriginFor<T>, proposal_id: u32, approve: bool) -> DispatchResult {
            let who = ensure_signed(origin)?;
            ensure!(Proposals::<T>::contains_key(proposal_id), Error::<T>::ProposalNotFound);
            ensure!(!Votes::<T>::contains_key(proposal_id, &who), Error::<T>::AlreadyVoted);
            Votes::<T>::insert(proposal_id, &who, approve);
            Self::deposit_event(Event::Voted(proposal_id, who, approve));
            Ok(())
        }
    }
}
