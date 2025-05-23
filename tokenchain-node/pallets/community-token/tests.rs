#![cfg(test)]

use super::*;
use frame_support::{assert_ok, assert_noop, traits::OnInitialize};
use sp_core::H256;
use frame_system as system;

#[test]
fn mint_works() {
    // Setup d'un environnement de test minimal
    // (À adapter selon votre runtime réelle)
    let mut ext = sp_io::TestExternalities::default();
    ext.execute_with(|| {
        let account = 1u64;
        assert_ok!(Pallet::<Test>::mint(system::RawOrigin::Root.into(), account, 100));
        assert_eq!(Balances::<Test>::get(account), 100);
    });
}

#[test]
fn transfer_fails_for_insufficient_balance() {
    let mut ext = sp_io::TestExternalities::default();
    ext.execute_with(|| {
        let alice = 1u64;
        let bob = 2u64;
        // Alice n'a pas de jetons
        assert_noop!(Pallet::<Test>::transfer(system::RawOrigin::Signed(alice).into(), bob, 50), Error::<Test>::InsufficientBalance);
    });
}
