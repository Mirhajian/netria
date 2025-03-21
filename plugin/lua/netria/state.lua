local M = {
  win_id = nil,
  buf_id = nil,
  current_dir = nil,
  netrw_bufs = {}, -- Track all netrw buffers created within our explorer
  initialized = false,
  last_opened_file = nil, -- Track the last opened file buffer
  started_with_dir = false, -- Track if Neovim was started with a directory
  original_buf = nil, -- Track the original buffer if started with directory
  adding_banner = false,
  banner_buffers = {}, -- Track which buffers already have banners
}

-- Initialize state
function M.initialize()
  M.win_id = nil
  M.buf_id = nil
  M.current_dir = nil
  M.netrw_bufs = {}
  M.initialized = false
  M.last_opened_file = nil
  M.started_with_dir = false
  M.original_buf = nil
  M.adding_banner = false
  M.banner_buffers = {}
end

-- Added for compatibility with netria.lua
function M.setup()
  M.initialize()
end

-- Check if a buffer is a netrw buffer
function M.is_netrw_buffer(buf_id)
  if not buf_id then return false end
  
  -- Check if it's in our tracked list
  if vim.tbl_contains(M.netrw_bufs, buf_id) then
    return true
  end
  
  -- Or check by filetype
  local ft = vim.bo[buf_id].filetype
  return ft == "netrw"
end

-- Count number of non-netrw buffers (file buffers)
function M.count_real_buffers()
  local count = 0
  for _, buf in ipairs(vim.api.nvim_list_bufs()) do
    -- Count only listed buffers that aren't netrw buffers
    if vim.api.nvim_buf_get_option(buf, "buflisted") and not M.is_netrw_buffer(buf) then
      count = count + 1
    end
  end
  return count
end

-- Get the current netrw directory
function M.get_netrw_directory()
  -- Get the directory from netrw's b:netrw_curdir variable
  local buf = vim.api.nvim_get_current_buf()
  if M.is_netrw_buffer(buf) then
    local success, dir = pcall(vim.api.nvim_buf_get_var, buf, "netrw_curdir")
    if success then
      return dir
    end
  end
  return vim.fn.getcwd()
end

return M
