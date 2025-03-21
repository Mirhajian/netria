local M = {}

local config = require('netria.config')
local state = require('netria.state')

function M.get_window_dimensions()
  local width = math.floor(vim.o.columns * config.values.width)
  local height = math.floor(vim.o.lines * config.values.height)
  
  local row = math.floor((vim.o.lines - height) / 2)
  local col = math.floor((vim.o.columns - width) / 2)
  
  if config.values.position == "left" then
    col = 0
  elseif config.values.position == "right" then
    col = vim.o.columns - width
  end
  
  return {
    width = width,
    height = height,
    row = row,
    col = col
  }
end

function M.apply_window_settings(win_id)
  if vim.api.nvim_win_is_valid(win_id) then
    if config.values.show_line_numbers then
      vim.wo[win_id].number = true
    end
    
    if config.values.show_relative_numbers then
      vim.wo[win_id].relativenumber = true
    end
    
    if config.values.no_wrap then
      vim.wo[win_id].wrap = false
    end
  end
end

function M.create_floating_window(directory)
  local buf = vim.api.nvim_create_buf(false, true)
  state.buf_id = buf
  table.insert(state.netrw_bufs, buf)

  local dim = M.get_window_dimensions()
  
  local win_opts = {
    relative = "editor",
    width = dim.width,
    height = dim.height,
    row = dim.row,
    col = dim.col,
    style = "minimal",
    title = config.values.title,
    title_pos = "center",
  }
  
  if config.values.border then
    win_opts.border = config.values.border_style
  end
  
  local win = vim.api.nvim_open_win(buf, true, win_opts)
  state.win_id = win
  
  vim.cmd("let g:netrw_banner = " .. (config.values.hide_banner and "0" or "1"))
  vim.cmd("let g:netrw_liststyle = " .. config.values.liststyle)
  vim.cmd("let g:netrw_winsize = " .. config.values.winsize)
  
  M.apply_window_settings(win)
  
  if directory then
    state.current_dir = directory
    vim.cmd("Explore " .. vim.fn.fnameescape(directory))
  else
    vim.cmd("Explore")
    vim.defer_fn(function()
      state.current_dir = state.get_netrw_directory()
    end, 10)
  end

  vim.defer_fn(function()
    if vim.api.nvim_buf_is_valid(buf) and vim.api.nvim_win_is_valid(win) then
      local banner = require('netria.banner')
      banner.add_custom_banner(buf, win)
      banner.create_banner_signs(buf)
    end
  end, 100)  -- increased delay
end

function M.open(directory)
  if state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
    vim.api.nvim_set_current_win(state.win_id)
  else
    M.create_floating_window(directory)
  end
end

function M.close()
  if state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
    vim.api.nvim_win_close(state.win_id, true)
    state.win_id = nil
    state.buf_id = nil
  end
end

function M.toggle(directory)
  if state.win_id and vim.api.nvim_win_is_valid(state.win_id) then
    M.close()
  else
    local dir_to_use = directory or state.current_dir or vim.fn.getcwd()
    M.open(dir_to_use)
  end
end

return M
