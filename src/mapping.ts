import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Squires,
  Approval,
  ApprovalForAll,
  OwnershipTransferred,
  Transfer
} from "../generated/Squires/Squires"
import { TransferSingle } from '../generated/SquirePotions/SquirePotions';
import {ItemData} from '../generated/SquirePotions/ItemData';
import { Squire, InventoryItem } from "../generated/schema"

export function handleTransfer(event: Transfer): void {
  let squire = Squire.load(event.params.tokenId.toString());

  if(!squire) squire = new Squire(event.params.tokenId.toString());

  let contract = Squires.bind(event.address);

  let tokenId = event.params.tokenId;

  let faith = contract.faithByTokenId(tokenId);
  let luck = contract.luckByTokenId(tokenId);
  let strength = contract.strengthByTokenId(tokenId);
  let type = contract.squireTypeByTokenId(tokenId);
  let wisdom = contract.wisdomByTokenId(tokenId);
  let genesis = contract.genesisByTokenId(tokenId);

  let tf = "";
  let image = "";
  
  squire.faith = faith;
  squire.luck = luck;
  squire.strength = strength;
  squire.type = type;
  squire.wisdom = wisdom;
  squire.genesis = genesis;
  squire.owner = event.params.to.toHexString();

  if (type.toI32() == 1 && genesis.toI32() === 0) {
    tf = "Strength";
    image = "https://knightsoftheether.com/squires/images/strength.png";

    squire.typename = tf;
    squire.image = image;
  }

  if (type.toI32() == 2 && genesis.toI32() === 0) {
      tf = "Wisdom";
      image = "https://knightsoftheether.com/squires/images/wisdom.png";

      squire.typename = tf;
      squire.image = image;
  }

  if (type.toI32() == 3 && genesis.toI32() === 0) {
      tf = "Luck";
      image = "https://knightsoftheether.com/squires/images/luck.png";

      squire.typename = tf;
      squire.image = image;
  }

  if (type.toI32() == 4 && genesis.toI32() === 0) {
      tf = "Faith";
      image = "https://knightsoftheether.com/squires/images/faith.png";

      squire.typename = tf;
      squire.image = image;
  }

  if (type.toI32() == 1 && genesis.toI32() == 1) {
      tf = "Genesis Strength";
      image = "https://knightsoftheether.com/squires/images/strengthG.png";

      squire.typename = tf;
      squire.image = image;
  }

  if (type.toI32() == 2 && genesis.toI32() == 1) {
      tf = "Genesis Wisdom";
      image = "https://knightsoftheether.com/squires/images/wisdomG.png";

      squire.typename = tf;
      squire.image = image;
  }

  if (type.toI32() == 3 && genesis.toI32() == 1) {
      tf = "Genesis Luck";
      image = "https://knightsoftheether.com/squires/images/luckG.png";

      squire.typename = tf;
      squire.image = image;
  }

  if (type.toI32() == 4 && genesis.toI32() == 1) {
      tf = "Genesis Faith";
      image = "https://knightsoftheether.com/squires/images/faithG.png";

      squire.typename = tf;
      squire.image = image;
  }

  squire.save();
}


export function handleItemTransfer(event: TransferSingle): void {

  let inventoryItem = InventoryItem.load(event.params.to.toHexString() + " " + event.params.id.toString() + " " + event.address.toHexString());

  if(!inventoryItem) {
    inventoryItem = new InventoryItem(event.params.to.toHexString() + " " + event.params.id.toString() + " " + event.address.toHexString());
    inventoryItem.itemid = event.params.id;
    inventoryItem.itemamount = event.params.value;
    inventoryItem.owner = event.params.to.toHexString();
    inventoryItem.contract = event.address.toHexString();
  } else {
    inventoryItem.itemamount = inventoryItem.itemamount.plus(event.params.value);
  }

  inventoryItem.save();

  if(Address.fromString("0x0000000000000000000000000000000000000000").equals(event.params.from))
    return;


  let otherInventory = InventoryItem.load(event.params.from.toHexString() + " " + event.params.id.toString() + " " + event.address.toHexString());

  if(otherInventory) {
    otherInventory.itemamount.minus(event.params.value);

    otherInventory.save();
  }
}