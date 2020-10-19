import { DataSourceContext } from "@graphprotocol/graph-ts"
import { NewLoanPool } from '../generated/loanPoolFactory/loanPoolFactory'
import { LoanPool } from '../generated/schema'
import { LoanPoolAave, LoanPoolMstable } from '../generated/templates'

export function handleNewLoanPool(event: NewLoanPool): void {
  let context = new DataSourceContext()
  if (event.params.lendingPool == 'Aave') {
    context.setString("loanPool", event.params.lendingPool)
    LoanPoolAave.createWithContext(event.params.loanPool, context)
  } else {
    context.setString("loanPool", event.params.lendingPool)
    LoanPoolMstable.createWithContext(event.params.loanPool, context)
  }
  let loanPool = new LoanPool(event.params.id.toHex())
  loanPool.loanPool = event.params.loanPool
  loanPool.collateralAmount = event.params.collateralAmount
  loanPool.minimumBidAmount = event.params.minimumBidAmount
  loanPool.auctionInterval = event.params.auctionInterval
  loanPool.auctionDuration = event.params.auctionDuration
  loanPool.maxParticipants = event.params.maxParticipants
  loanPool.tokenAddress = event.params.tokenAddress
  loanPool.lendingPool = event.params.lendingPool
  loanPool.creator = event.params.creator
  loanPool.createdAt = event.params.createdAt
  loanPool.save()
}
