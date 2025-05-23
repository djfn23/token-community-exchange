#![cfg_attr(not(feature = "std"), no_std)]

//! Pallet AMM: Automated Market Maker simple pour TokenChain
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
    #[pallet::getter(fn pools)]
    pub type Pools<T: Config> = StorageMap<_, Blake2_128Concat, (u32, u32), (u128, u128), OptionQuery>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        PoolCreated(u32, u32),
        Swapped(T::AccountId, u32, u32, u128, u128),
    }

    #[pallet::error]
    pub enum Error<T> {
        PoolExists,
        PoolNotFound,
        InsufficientLiquidity,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::weight(10_000)]
        pub fn create_pool(origin: OriginFor<T>, token_a: u32, token_b: u32, amount_a: u128, amount_b: u128) -> DispatchResult {
            let who = ensure_signed(origin)?;
            ensure!(!Pools::<T>::contains_key((token_a, token_b)), Error::<T>::PoolExists);
            Pools::<T>::insert((token_a, token_b), (amount_a, amount_b));
            Self::deposit_event(Event::PoolCreated(token_a, token_b));
            Ok(())
        }
        #[pallet::weight(10_000)]
        pub fn swap(origin: OriginFor<T>, token_a: u32, token_b: u32, amount_in: u128) -> DispatchResult {
            let who = ensure_signed(origin)?;
            Pools::<T>::try_mutate((token_a, token_b), |maybe_pool| {
                let (mut reserve_a, mut reserve_b) = maybe_pool.ok_or(Error::<T>::PoolNotFound)?;
                // Formule x*y=k simplifiée, sans frais
                let amount_out = (amount_in * reserve_b) / (reserve_a + amount_in);
                ensure!(amount_out > 0 && reserve_b >= amount_out, Error::<T>::InsufficientLiquidity);
                reserve_a += amount_in;
                reserve_b -= amount_out;
                *maybe_pool = Some((reserve_a, reserve_b));
                Self::deposit_event(Event::Swapped(who, token_a, token_b, amount_in, amount_out));
                Ok(())
            })
        }
    }
}
