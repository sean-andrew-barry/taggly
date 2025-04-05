const MIN_BLOCK_SIZE = 4 + 1 + 100;
export class MemoryManager
{
  constructor(shared_array_buffer)
  {
    this.buffer = shared_array_buffer;
    this.view = new DataView(shared_array_buffer);
    this.free_list = []; // Maintain a list of free blocks
    this.allocated_list = new Map(); // Maintain a map of allocated blocks
  }

  allocate(size, url)
  {
    // Validate input size
    if (size <= 0)
    {
      throw new Error("Invalid size for allocation.");
    }

    // 1. Find a suitable block
    const suitableBlock = this.findSuitableFreeBlock(size);

    if (!suitableBlock)
    {
      throw new Error("Allocation failed. No suitable block found.");
    }

    // 2. Allocate the required space. If there's a leftover, split the block.
    const leftoverSize = suitableBlock.getSize() - size;
    if (leftoverSize > MIN_BLOCK_SIZE)
    {
      // Assume a constant that dictates the minimum size for a block
      suitableBlock.split(size);
      this.free_list.push(new Block(this.view, suitableBlock.end)); // Add the split-off block back to the free list
    }

    // 3. Remove the block from the free_list
    const index = this.free_list.indexOf(suitableBlock);
    if (index !== -1)
    {
      this.free_list.splice(index, 1);
    }

    // 4. Add to the allocated list
    this.allocated_list.set(url, suitableBlock);

    // Update the block type to indicate it's allocated
    suitableBlock.type = 1; // Assuming 1 means allocated block
  }

  findSuitableFreeBlock(size)
  {
    // Using a simple linear search for now. This can be optimized with binary search if free_list is sorted by size.
    for (let block of this.free_list)
    {
      if (block.getSize() >= size)
      {
        return block;
      }
    }
    return null;
  }

  deallocate(url)
  {
    const block = this.allocated_list.get(url);

    if (!block)
    {
      throw new Error(`No block found for the given URL: ${url}`);
    }

    // Mark block as unallocated
    block.type = 0; // Assuming 0 means unallocated block

    // Remove the block from the allocated list
    this.allocated_list.delete(url);

    // Combine with neighboring free blocks if possible
    const prevBlock = this.getBlockByEnd(block.start);
    const nextBlock = this.getBlockByStart(block.end);

    if (prevBlock && prevBlock.type === 0)
    {
      prevBlock.Combine(block);
      block.start = prevBlock.start; // Update the start of the block after merging
      const index = this.free_list.indexOf(prevBlock);
      if (index !== -1)
      {
        this.free_list.splice(index, 1); // Remove the merged block from the free list
      }
    }

    if (nextBlock && nextBlock.type === 0)
    {
      block.Combine(nextBlock);
      const index = this.free_list.indexOf(nextBlock);
      if (index !== -1)
      {
        this.free_list.splice(index, 1); // Remove the merged block from the free list
      }
    }

    // Add the block (merged or original) to the free list
    this.free_list.push(block);
  }

  getBlockByEnd(end)
  {
    // This method retrieves a block using its end value. Useful for finding the previous block.
    for (let block of this.free_list)
    {
      if (block.end === end)
      {
        return block;
      }
    }

    return null;
  }

  getBlockByStart(start)
  {
    // This method retrieves a block using its start value. Useful for finding the next block.
    for (let block of this.free_list)
    {
      if (block.start === start)
      {
        return block;
      }
    }

    return null;
  }

  scanMemory()
  {
    let currentStart = 0; // Start scanning from the beginning of the buffer

    while (currentStart < this.view.byteLength)
    {
      const block = new Block(this.view, currentStart);

      if (this.isBlockFree(block))
      {
        this.free_list.push(block);
      }
      else
      {
        const url = this.extractURLFromBlock(block); // Pseudocode to get the URL or key for the block
        this.allocated_list.set(url, block);
      }

      currentStart = block.end;
    }
  }

  isBlockFree(block)
  {
    // Pseudocode: Determine if a block is free or not. 
    // This could be based on the type or some other metadata in the block.
    return block.type === 0; // Assuming 0 means free block, for example
  }

  extractURLFromBlock(block)
  {
    // Pseudocode: Extract the URL or some key from the allocated block
    // This would depend on how you've encoded or stored the URL in the block
    return "some-url"; // Placeholder
  }

  // ... Other methods for deallocation, block management, synchronization, etc.
}