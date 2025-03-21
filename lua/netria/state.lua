local M = {
  win_id = nil,
  buf_id = nil,
  current_dir = nil,
  netrw_bufs = {},
  initialized = false,
  last_opened_file = nil,
  started_with_dir = false,
  original_buf = nil,
  adding_banner = false,
  banner_buffers = {},
}

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

function M.setup()
  M.initialize()
end

function M.is_netrw_buffer(buf_id)
  if not buf_id then return false end
  
  if vim.tbl_contains(M.netrw_bufs, buf_id) then
    return true
  end
  
  local ft = vim.bo[buf_id].filetype
  return ft == "netrw"
end

function M.count_real_buffers()
  local count = 0
  for _, buf in ipairs(vim.api.nvim_list_bufs()) do
    if vim.api.nvim_buf_get_option(buf, "buflisted") and not M.is_netrw_buffer(buf) then
      count = count + 1
    end
  end
  return count
end

function M.get_netrw_directory()
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
