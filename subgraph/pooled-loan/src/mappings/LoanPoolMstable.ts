import { dataSource } from "@graphprotocol/graph-ts"
import { NewParticipant, NewBidder, ClaimedLoan, ClaimedFinalYield} from '../generated/LoanPoolMstable/LoanPoolMstable'
import { Participant, Bid, LoanClaimed, FinalYieldClaimed } from '../generated/schema'

let context = dataSource.context()
let loanPool = context.getString("loanPool")

export function handleNewParticipation(event: NewParticipant): void {
    let participant = new Participant(loanPool + event.params.participant.toHex())
    participant.participant = event.params.participant
    participant.save()
}

export function handleNewBid( event: NewBidder): void {
    let bidder = new Bid(event.params.bidder.toHex()+ event.params.amount.toHex())
    bidder.bidder = event.params.bidder
    bidder.amount = event.params.amount
    bidder.term = event.params.term
    bidder.timestamp = event.params.timestamp
    bidder.save()
}

export function handleLoanClaimed(event: ClaimedLoan): void {
    let loanClaimed = new LoanClaimed(loanPool + event.params.claimer.toHex())
    loanClaimed.claimer = event.params.claimer
    loanClaimed.amount = event.params.amount
    loanClaimed.term = event.params.term
    loanClaimed.save()
}

export function handleClaimedFinalYield(event: ClaimedFinalYield): void {
    let finalYieldClaimed = new FinalYieldClaimed(loanPool + event.params.participant)
    finalYieldClaimed.participant = event.params.participant
    finalYieldClaimed.amount = event.params.amount
}
