import { NewLoanPool } from '../generated/loanPoolFactory/loanPoolFactory'
import { LoanPool } from '../generated/schema'
import { LoanPoolAave, LoanPoolMstable } from '../generated/templates'

export function handleNewLoanPool(event: NewLoanPool): void {
  let context = new DataSourceContext()
  if (event.params.lendingPool == 'Aave') {
    context.setString("loanPool", event.params.lendingPool)
    LoanPoolAave.create(event.params.loanPool, context)
  } else {
    context.setString("loanPool", event.params.lendingPool)
    LoanPoolMstable.create(event.params.loanPool, context)
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
// export function handleNewGravatar(event: NewGravatar): void {
//   let gravatar = new Gravatar(event.params.id.toHex())
//   gravatar.owner = event.params.owner
//   gravatar.displayName = event.params.displayName
//   gravatar.imageUrl = event.params.imageUrl
//   gravatar.save()
// }

// export function handleUpdatedGravatar(event: UpdatedGravatar): void {
//   let id = event.params.id.toHex()
//   let gravatar = Gravatar.load(id)
//   if (gravatar == null) {
//     gravatar = new Gravatar(id)
//   }
//   gravatar.owner = event.params.owner
//   gravatar.displayName = event.params.displayName
//   gravatar.imageUrl = event.params.imageUrl
//   gravatar.save()
// }
