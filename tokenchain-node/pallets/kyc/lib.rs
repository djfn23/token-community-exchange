#![cfg_attr(not(feature = "std"), no_std)]

//! Pallet KYC: gestion simple des utilisateurs vérifiés pour TokenChain
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
    #[pallet::getter(fn is_verified)]
    pub type Verified<T: Config> = StorageMap<_, Blake2_128Concat, T::AccountId, bool, ValueQuery>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        Verified(T::AccountId),
        Unverified(T::AccountId),
    }

    #[pallet::error]
    pub enum Error<T> {
        AlreadyVerified,
        NotVerified,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::weight(10_000)]
        pub fn verify(origin: OriginFor<T>, who: T::AccountId) -> DispatchResult {
            let _ = ensure_root(origin)?;
            ensure!(!Verified::<T>::get(&who), Error::<T>::AlreadyVerified);
            Verified::<T>::insert(&who, true);
            Self::deposit_event(Event::Verified(who));
            Ok(())
        }
        #[pallet::weight(10_000)]
        pub fn unverify(origin: OriginFor<T>, who: T::AccountId) -> DispatchResult {
            let _ = ensure_root(origin)?;
            ensure!(Verified::<T>::get(&who), Error::<T>::NotVerified);
            Verified::<T>::insert(&who, false);
            Self::deposit_event(Event::Unverified(who));
            Ok(())
        }
    }
}
