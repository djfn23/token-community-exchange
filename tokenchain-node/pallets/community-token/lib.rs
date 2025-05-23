#![cfg_attr(not(feature = "std"), no_std)]

///! Pallet Community Token: gestion simple de jetons communautaires pour TokenChain
use frame_support::{dispatch::DispatchResult, pallet_prelude::*, traits::Currency};
use frame_system::pallet_prelude::*;

#[frame_support::pallet]
pub mod pallet {
    use super::*;

    #[pallet::config]
    pub trait Config: frame_system::Config {
        /// Événements générés par la palette
        type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;
    }

    #[pallet::storage]
    #[pallet::getter(fn balance_of)]
    pub type Balances<T: Config> = StorageMap<_, Blake2_128Concat, T::AccountId, u128, ValueQuery>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        Minted(T::AccountId, u128),
        Burned(T::AccountId, u128),
        Transferred(T::AccountId, T::AccountId, u128),
    }

    #[pallet::error]
    pub enum Error<T> {
        InsufficientBalance,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        /// Mint des jetons à un compte
        #[pallet::weight(10_000)]
        pub fn mint(origin: OriginFor<T>, to: T::AccountId, amount: u128) -> DispatchResult {
            let _ = ensure_root(origin)?;
            Balances::<T>::mutate(&to, |bal| *bal += amount);
            Self::deposit_event(Event::Minted(to, amount));
            Ok(())
        }

        /// Brûle des jetons d'un compte
        #[pallet::weight(10_000)]
        pub fn burn(origin: OriginFor<T>, from: T::AccountId, amount: u128) -> DispatchResult {
            let _ = ensure_root(origin)?;
            Balances::<T>::try_mutate(&from, |bal| {
                if *bal < amount {
                    return Err(Error::<T>::InsufficientBalance.into());
                }
                *bal -= amount;
                Ok(())
            })?;
            Self::deposit_event(Event::Burned(from, amount));
            Ok(())
        }

        /// Transfert de jetons entre comptes
        #[pallet::weight(10_000)]
        pub fn transfer(origin: OriginFor<T>, to: T::AccountId, amount: u128) -> DispatchResult {
            let from = ensure_signed(origin)?;
            Balances::<T>::try_mutate(&from, |bal_from| {
                if *bal_from < amount {
                    return Err(Error::<T>::InsufficientBalance.into());
                }
                *bal_from -= amount;
                Balances::<T>::mutate(&to, |bal_to| *bal_to += amount);
                Ok(())
            })?;
            Self::deposit_event(Event::Transferred(from, to, amount));
            Ok(())
        }
    }
}
