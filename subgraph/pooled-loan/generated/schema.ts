// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class LoanPool extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save LoanPool entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save LoanPool entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("LoanPool", id.toString(), this);
  }

  static load(id: string): LoanPool | null {
    return store.get("LoanPool", id) as LoanPool | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get loanPool(): Bytes {
    let value = this.get("loanPool");
    return value.toBytes();
  }

  set loanPool(value: Bytes) {
    this.set("loanPool", Value.fromBytes(value));
  }

  get collateralAmount(): BigInt {
    let value = this.get("collateralAmount");
    return value.toBigInt();
  }

  set collateralAmount(value: BigInt) {
    this.set("collateralAmount", Value.fromBigInt(value));
  }

  get minimumBidAmount(): BigInt {
    let value = this.get("minimumBidAmount");
    return value.toBigInt();
  }

  set minimumBidAmount(value: BigInt) {
    this.set("minimumBidAmount", Value.fromBigInt(value));
  }

  get auctionInterval(): BigInt {
    let value = this.get("auctionInterval");
    return value.toBigInt();
  }

  set auctionInterval(value: BigInt) {
    this.set("auctionInterval", Value.fromBigInt(value));
  }

  get auctionDuration(): BigInt {
    let value = this.get("auctionDuration");
    return value.toBigInt();
  }

  set auctionDuration(value: BigInt) {
    this.set("auctionDuration", Value.fromBigInt(value));
  }

  get maxParticipants(): i32 {
    let value = this.get("maxParticipants");
    return value.toI32();
  }

  set maxParticipants(value: i32) {
    this.set("maxParticipants", Value.fromI32(value));
  }

  get tokenAddress(): Bytes {
    let value = this.get("tokenAddress");
    return value.toBytes();
  }

  set tokenAddress(value: Bytes) {
    this.set("tokenAddress", Value.fromBytes(value));
  }

  get lendingPool(): string {
    let value = this.get("lendingPool");
    return value.toString();
  }

  set lendingPool(value: string) {
    this.set("lendingPool", Value.fromString(value));
  }

  get creator(): Bytes {
    let value = this.get("creator");
    return value.toBytes();
  }

  set creator(value: Bytes) {
    this.set("creator", Value.fromBytes(value));
  }

  get createdAt(): BigInt {
    let value = this.get("createdAt");
    return value.toBigInt();
  }

  set createdAt(value: BigInt) {
    this.set("createdAt", Value.fromBigInt(value));
  }
}

export class Participant extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Participant entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Participant entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Participant", id.toString(), this);
  }

  static load(id: string): Participant | null {
    return store.get("Participant", id) as Participant | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get loanPool(): Bytes {
    let value = this.get("loanPool");
    return value.toBytes();
  }

  set loanPool(value: Bytes) {
    this.set("loanPool", Value.fromBytes(value));
  }

  get participant(): Bytes {
    let value = this.get("participant");
    return value.toBytes();
  }

  set participant(value: Bytes) {
    this.set("participant", Value.fromBytes(value));
  }
}

export class Bid extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Bid entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Bid entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Bid", id.toString(), this);
  }

  static load(id: string): Bid | null {
    return store.get("Bid", id) as Bid | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get loanPool(): Bytes {
    let value = this.get("loanPool");
    return value.toBytes();
  }

  set loanPool(value: Bytes) {
    this.set("loanPool", Value.fromBytes(value));
  }

  get bidder(): Bytes {
    let value = this.get("bidder");
    return value.toBytes();
  }

  set bidder(value: Bytes) {
    this.set("bidder", Value.fromBytes(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get term(): BigInt {
    let value = this.get("term");
    return value.toBigInt();
  }

  set term(value: BigInt) {
    this.set("term", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }
}

export class LoanClaimed extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save LoanClaimed entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save LoanClaimed entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("LoanClaimed", id.toString(), this);
  }

  static load(id: string): LoanClaimed | null {
    return store.get("LoanClaimed", id) as LoanClaimed | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get loanPool(): Bytes {
    let value = this.get("loanPool");
    return value.toBytes();
  }

  set loanPool(value: Bytes) {
    this.set("loanPool", Value.fromBytes(value));
  }

  get claimer(): Bytes {
    let value = this.get("claimer");
    return value.toBytes();
  }

  set claimer(value: Bytes) {
    this.set("claimer", Value.fromBytes(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get term(): BigInt {
    let value = this.get("term");
    return value.toBigInt();
  }

  set term(value: BigInt) {
    this.set("term", Value.fromBigInt(value));
  }
}

export class FinalYieldClaimed extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save FinalYieldClaimed entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save FinalYieldClaimed entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("FinalYieldClaimed", id.toString(), this);
  }

  static load(id: string): FinalYieldClaimed | null {
    return store.get("FinalYieldClaimed", id) as FinalYieldClaimed | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get loanPool(): Bytes {
    let value = this.get("loanPool");
    return value.toBytes();
  }

  set loanPool(value: Bytes) {
    this.set("loanPool", Value.fromBytes(value));
  }

  get participant(): Bytes {
    let value = this.get("participant");
    return value.toBytes();
  }

  set participant(value: Bytes) {
    this.set("participant", Value.fromBytes(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }
}
