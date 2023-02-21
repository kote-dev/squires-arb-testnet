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

const RING_NAMES = ["Gold Ring of Burn Defense", "Gold Ring of Avoidance", "Steel Ring of Fiendsbane", "Titanium Ring of Fey Resistance", "Gold Ring of Energy", "Titanium Ring of the Forest", "Silver Ring of Restoration", "Bronze Ring of Alchemy", "Platinum Ring of Confusion", "Rose Gold Ring of Reaction", "Diamond Ring of Spikes", "Brass Ring of Advantage", "Kyanite Ring of Courage", "Gold Ring of Ingenuity", "Silver Ring of the Deep Sleep", "Gold Ring of Combustion", "Silver Ring of Duplication", "Brass Ring of Quick Reflexes", "Marble Ring of Retention", "Pearl Ring of Spirit", "Stone Ring of Increase", "Steel Ring of Protection", "Gold Ring of Determination", "Amber Ring of Withstanding", "Etheric Ring of Renewal"]
const POTION_NAMES = ["Luck Potion", "Levitation Potion", "Strong Brew", "Pava Root Potion", "Spring Water Flask", "Mirroring Potion", "Phial of Defense", "Slime Vial", "Ichor Draft", "Holy Water", "Murky Flask", "Arcane Brew", "Berserkers Brew", "Spirit Vial", "Flask of Resolve", "Lucidity Elixir", "Philter of Redemption", "Lavender Extract", "Trippie Draught", "Phantom Phial", "Bloodlust Flask", "Misty Phial", "Spirit Elixir", "Dew Drop Vial", "Master Brew"]
const TRINKET_NAMES = ["Wee Red Mushroom", "Pine Resin", "Birdcage", "Glowing Rune", "Ether Crystal", "Rabbit Foot", "Poisonous Frog", "Acorns", "Torch", "Dream Amulet", "Dusty Scroll", "Crustacean Claw", "Goblet", "Draca Fangs", "Gargoyle", "Bat Wing", "Runic Tome", "Lucky Die", "Golem Eye", "Phoenix Egg", "Abyssal Talisman", "Enchanted Goggles", "Magic Coinpurse", "Hand Candle", "Mask of Valathor", "Wild Cucumber", "Underdark Egg"]


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

  let itemType = '';
  let itemNames = POTION_NAMES;

  if(Address.fromString("0xfc6fc6bc755FCe9449ac082aE88a4ACC881e3412").equals(event.address)) {
    itemType = "potion";
    itemNames = POTION_NAMES;
  }

  if(Address.fromString("0x9289908164843f14FA67684FdfBc40e778db444B").equals(event.address)) {
    itemType = "ring";
    itemNames = RING_NAMES;
  }

  if(Address.fromString("0x96b273dCB8b4c0aa736694B2580DD3A23762E819").equals(event.address)) {
    itemType = "trinket";
    itemNames = TRINKET_NAMES;
  }

  let baseItemId = event.params.id.toI32() % 100;

  let inventoryItem = InventoryItem.load(event.params.to.toHexString() + " " + event.params.id.toString() + " " + event.address.toHexString());

  

  if(!inventoryItem) {
    inventoryItem = new InventoryItem(event.params.to.toHexString() + " " + event.params.id.toString() + " " + event.address.toHexString());
    inventoryItem.itemid = event.params.id;
    inventoryItem.itemamount = event.params.value;
    inventoryItem.owner = event.params.to.toHexString();
    inventoryItem.contract = event.address.toHexString();
    inventoryItem.name = itemNames[baseItemId];

    let image = "https://knightsoftheether.com/squires/images/" + itemType.toLowerCase() + "s/" + itemNames[baseItemId].replaceAll(" ", "%20") + ".png";
    inventoryItem.image = image;
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