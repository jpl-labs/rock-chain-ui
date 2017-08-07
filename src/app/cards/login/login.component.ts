import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, NgForm, Validators  } from '@angular/forms';
import { BlockchainService } from '../../services/blockchain.service';
import { Wallet } from '../../../models/Wallet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model = {
    walletHash: '',
    password: ''
  };

  wallet: Wallet;
  blockchainService: BlockchainService;
  router: Router;

  submitDisabled: boolean;

  constructor(
    private _blockchainService: BlockchainService,
    private _router: Router
  ) {
    this.blockchainService = _blockchainService;
    this.router = _router;
    this.submitDisabled = false;
  }

  ngOnInit() {
  }

  onSubmit = () => {
    if (this.model.walletHash) {
      this.blockchainService.unlockAccount(this.model.walletHash, this.model.password, 2).subscribe(success => {
        if (success) {
          this.submitDisabled = true;

          this.wallet = {
            id: this.model.walletHash,
            balance: 0
          };

          localStorage.setItem('walletId', this.wallet.id);
          window.location.reload();
        }

      }, err => {
        alert(`There was an error retrieving your wallet: ${err.message}`);
      });
    }
  }

}
